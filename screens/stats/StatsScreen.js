import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { capitalize, isEmpty, minBy } from 'lodash';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Pages } from 'react-native-pages';
import moment from 'moment';

import Categories from '../../constants/Categories';
import Colors from '../../constants/Colors';
import StyledHeaderButton from '../../components/UI/StyledHeaderButton';
import BasicReceiptsFiltering from '../../components/shared/BasicReceiptsFiltering';
import ModePicker from '../../components/stats/ModePicker';
import StatsTable from '../../components/stats/StatsTable';
import PieChart from '../../components/stats/charts/PieChart';
import PolarChart from '../../components/stats/charts/PolarChart';
import LineChart from '../../components/stats/charts/LineChart';
import StyledText from '../../components/UI/StyledText';
import CustomRangeModal from '../../components/shared/CustomRangeModal';

// const FILTERS = {
//   month: (receipt) =>
//     receipt.date.getMonth() >= new Date().getMonth() && receipt.date.getFullYear() === new Date().getFullYear(),
//   year: (receipt) => receipt.date.getFullYear() === new Date().getFullYear(),
//   all: (receipt) => receipt,
//   range: (receipt) => false, // add range option
// };

// const RANGES = {
//   month: { start: () => moment().startOf('month').format('DD.MM.YYYY'), end: moment().format('DD.MM.YYYY') },
//   year: { start: () => moment().startOf('year').format('DD.MM.YYYY'), end: moment().format('DD.MM.YYYY') },
//   all: {
//     start: (receipts) =>
//       receipts
//         ? moment(minBy(receipts, (receipt) => receipt.date).date).format('DD.MM.YYYY')
//         : moment().format('DD.MM.YYYY'), // nie jest potrzeben date w środku
//     end: moment().format('DD.MM.YYYY'),
//   },
//   range: { start: () => moment().startOf('month').format('DD.MM.YYYY'), end: moment().format('DD.MM.YYYY') }, // idk
// };

// zastąpić wszędzie new Date() -> moment().toDate() albo nawet bez toDate()
const RANGES = {
  month: { start: () => moment().startOf('month').startOf('day').toDate(), end: moment().toDate() },
  year: { start: () => moment().startOf('year').startOf('day').toDate(), end: moment().toDate() },
  all: {
    start: (receipts) =>
      receipts
        ? moment(minBy(receipts, (receipt) => receipt.date.getTime()).date)
            .startOf('day')
            .toDate()
        : moment().toDate(), // nie jest potrzeben date w środku
    end: moment().toDate(),
  },
  range: { start: () => moment().startOf('month').startOf('day').toDate(), end: moment().toDate() },
};

const getSummaryConfig = (dateRange, receipts) => {
  switch (dateRange) {
    case 'all':
      return {
        startUnit: minBy(receipts, (receipt) => receipt.date).date.getFullYear(),
        endUnit: new Date().getFullYear(),
        mappedReceipts: receipts.map((receipt) => ({ ...receipt, date: receipt.date.getFullYear() })),
      };
    case 'year':
      return {
        startUnit: 0,
        endUnit: new Date().getMonth(),
        mappedReceipts: receipts.map((receipt) => ({ ...receipt, date: receipt.date.getMonth() })),
      };
    case 'month':
      return {
        startUnit: 1,
        endUnit: new Date().getDate(),
        mappedReceipts: receipts.map((receipt) => ({ ...receipt, date: receipt.date.getDay() })),
      };
  }
  return {
    startUnit: 0,
    endUnit: 0,
    mappedReceipts: [],
  };
};

const getRangeConfig = (dateRange, receipts) => {
  switch (dateRange) {
    case 'years':
      return {
        startDate: minBy(receipts, (receipt) => receipt.date).date.getFullYear(),
        endDate: new Date().getFullYear(),
        mappedReceipts: receipts.map((receipt) => ({ ...receipt, date: receipt.date.getFullYear() })),
      };
    case 'months':
      return {
        startUnit: 0,
        endUnit: new Date().getMonth(),
        mappedReceipts: receipts.map((receipt) => ({ ...receipt, date: receipt.date.getMonth() })),
      };
    case 'days':
      return {
        startDate: 1,
        endDate: new Date().getDate(),
        mappedReceipts: receipts.map((receipt) => ({ ...receipt, date: receipt.date.getDay() })),
      };
  }
  return {
    startUnit: 0,
    endUnit: 0,
    mappedReceipts: [],
  };
};

// extract to hook and improve
const getData = (receipts, total, mode, dateRange, allTags, summaryRange, startDate, endDate) => {
  switch (mode) {
    case 'categories':
      return Object.values(Categories).reduce((acc, category) => {
        const categoryTotal = receipts
          .filter((receipt) => receipt.category === category)
          .reduce((acc, receipt) => acc + receipt.total, 0);
        acc.push({ x: capitalize(category), y: categoryTotal, percent: (categoryTotal / total) * 100 || 0 }); // 0 for not NaN in statsTable
        return acc;
      }, []);
    case 'tags':
      let tagsTotal = 0;
      const tagsData = allTags.reduce((acc, tag) => {
        const tagTotal = receipts
          .filter((receipt) => receipt.tags.map((tag) => tag.id).includes(tag.id))
          .reduce((sum, receipt) => sum + receipt.tags.find((cTag) => cTag.id === tag.id).value, 0);
        tagsTotal += tagTotal;
        acc.push({ x: capitalize(tag.key), y: tagTotal, percent: (tagTotal / total) * 100 || 0 });
        return acc;
      }, []);
      tagsData.push({ x: 'Rest', y: total - tagsTotal, percent: ((total - tagsTotal) / total) * 100 || 0 });
      return tagsData;
    case 'summary': // improve
      if (dateRange === 'range') {
        const data = [];
        for (let m = moment(startDate); m.diff(endDate, summaryRange) <= 0; m.add(1, summaryRange)) {
          const unitTotal = receipts
            .filter((receipt) => moment(receipt.date).diff(m, summaryRange) === 0)
            .reduce((acc, receipt) => acc + receipt.total, 0);
          data.push({
            x: m.format(summaryRange === 'days' ? 'YYYY-MM-DD' : summaryRange === 'months' ? 'YYYY-MM' : 'YYYY'),
            y: unitTotal,
            percent: (unitTotal / total) * 100 || 0,
          });
        }
        return data;
      }
      const { startUnit, endUnit, mappedReceipts } = getSummaryConfig(dateRange, receipts);
      const data = [];
      for (let unit = startUnit; unit <= endUnit; unit++) {
        const unitTotal = mappedReceipts
          .filter((receipt) => receipt.date === unit)
          .reduce((acc, receipt) => acc + receipt.total, 0);
        data.push({
          x: dateRange === 'year' ? moment.monthsShort()[unit] : unit.toString(),
          y: unitTotal,
          percent: (unitTotal / total) * 100 || 0,
        });
      }
      return data;
  }
  return [];
};

// ujednolicić porównywanie dat z momentem łatwiej

// w tagach wykres słupkowy i tak jak zrobię w kategoriach że dla pojedynczego tagu

// sortowanie statsTable zależnie od mode oraz zaznaczenie tyvh linijek żeby było widać
// sortowanie po naciśnięciu

const StatsScreen = (props) => {
  const [mode, setMode] = useState('categories');
  const [dateRange, setDateRange] = useState('month');
  const [isPickerVisible, setIsPickerVisible] = useState(dateRange === 'range');
  const allReceipts = useSelector((state) => state.receipts.userReceipts);
  const [startDate, setStartDate] = useState(RANGES[dateRange].start(allReceipts)); // przy startDate minimalna godzina a przy endDate maxymalna
  const [endDate, setEndDate] = useState(RANGES[dateRange].end);

  const [summaryRange, setSummaryRange] = useState('months');

  const allTags = useSelector((state) => state.tags.userTags);

  const receipts = allReceipts.filter(
    (receipt) => receipt.date.getTime() >= startDate.getTime() && receipt.date.getTime() <= endDate.getTime()
  );
  // do kategorii i tagów można też dodać te wykresy liniowe jak się zmieniały w czasie wydatki dla kategorii
  // tylko trzeba tam gdzieś wcisnąć wybór kategorii XD np tam na dole byłby spoko i go jakoś zaznaczyć ale tylko przy tamtym widoku?

  const total = receipts.reduce((acc, receipt) => acc + receipt.total, 0);
  const data = getData(receipts, total, mode, dateRange, allTags, summaryRange, startDate, endDate);
  // const total = data.reduce((acc, element) => acc + element.y, 0);

  useEffect(() => {
    setStartDate(RANGES[dateRange].start(allReceipts));
    setEndDate(RANGES[dateRange].end);
  }, [dateRange]);

  const categoriesCharts = (
    <Pages style={styles.pages} indicatorColor={Colors.primary}>
      <View style={styles.flexOne}>
        <PieChart data={data} hasData={!isEmpty(receipts)} />
      </View>
      <View style={styles.flexOne}>
        <PolarChart data={mode === 'tags' ? data.slice(0, -1) : data} />
      </View>
    </Pages>
  );

  const summaryCharts = (
    <View style={styles.flexOne}>
      <LineChart
        data={data}
        hasData={!isEmpty(receipts)}
        label={dateRange === 'all' ? 'Years' : dateRange === 'year' ? 'Months' : 'Days'}
      />
    </View>
  );

  const renderModeCharts = () => {
    if (mode === 'summary') {
      return summaryCharts;
    }
    return categoriesCharts;
  };

  const handleApply = (startDate, endDate, units) => {
    setStartDate(moment(startDate).startOf('day').toDate());
    setEndDate(moment(endDate).endOf('day').toDate());
    setIsPickerVisible(false);
    mode === 'summary' && setSummaryRange(units);
  };

  return (
    <View style={styles.flexOne}>
      <CustomRangeModal
        isVisible={isPickerVisible}
        mode={mode}
        onApply={handleApply}
        onClose={() => setIsPickerVisible(false)}
      />
      <BasicReceiptsFiltering dateRange={dateRange} setDateRange={setDateRange} setRangePicker={setIsPickerVisible} />
      <ModePicker mode={mode} setMode={setMode} />
      <StyledText style={styles.rangeLabel}>
        Date range: {moment(startDate).format('DD.MM.YYYY')} - {moment(endDate).format('DD.MM.YYYY')}
      </StyledText>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pagesContainer}>{renderModeCharts()}</View>
        <StatsTable data={data} total={total} mode={mode} />
      </ScrollView>
    </View>
  );
};

StatsScreen.navigationOptions = {
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={StyledHeaderButton}>
      <Item title='Edit' iconName={Platform.OS === 'android' ? 'md-settings' : 'ios-settings'} onPress={() => {}} />
    </HeaderButtons>
  ),
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  pagesContainer: {
    height: 400, // not hardcoded
  },
  pages: {
    marginTop: 15,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeLabel: {
    padding: 10,
    textAlign: 'center',
  },
});

export default StatsScreen;
