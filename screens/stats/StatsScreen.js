import React, { useState } from 'react';
import { View, ScrollView, Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { capitalize, isEmpty, isUndefined, minBy } from 'lodash';
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

const FILTERS = {
  month: (receipt) =>
    receipt.date.getMonth() >= new Date().getMonth() && receipt.date.getFullYear() === new Date().getFullYear(),
  year: (receipt) => receipt.date.getFullYear() === new Date().getFullYear(),
  all: (receipt) => receipt,
  range: (receipt) => false, // add range option
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
        endUnit: new Date().getDay(),
        mappedReceipts: receipts.map((receipt) => ({ ...receipt, date: receipt.date.getDay() })),
      };
  }
  return {
    startUnit: 0,
    endUnit: 0,
    mappedReceipts: [],
  };
};

// extract to hook
const getData = (receipts, total, mode, dateRange) => {
  switch (mode) {
    case 'categories':
      return Object.values(Categories).reduce((data, category) => {
        const categoryTotal = receipts
          .filter((receipt) => receipt.category === category)
          .reduce((acc, receipt) => acc + receipt.total, 0);
        data.push({ x: capitalize(category), y: categoryTotal, percent: (categoryTotal / total) * 100 || 0 }); // 0 for not NaN in statsTable
        return data;
      }, []);
    case 'tags':
      return [];
    case 'summary': // improve
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

// w tagach wykres słupkowy i tak jak zrobię w kategoriach że dla pojedynczego tagu

// sortowanie statsTable zależnie od mode oraz zaznaczenie tyvh linijek żeby było widać
// sortowanie po naciśnięciu

// muszę gdzieś mieć tagi do selektora więc oprócz w paragonach (tam mogą być tylko id taga)

// 3 rodzaje wykresów: kategorie, wydatki całościowe, tagi (tutaj można tak jak całościowe tylko na dole labele i po naciśnięciu wykres tego a tak to wszystkich?)
// każdy daty filtrowanie wybrany miesiąc, wybrany rok, custom date

// gdzieś wypisać jaki teraz jest filtr
// clear filters

// ususwanie tagów (może w tych ustawieniach po lewej?)

const StatsScreen = (props) => {
  const [mode, setMode] = useState('categories');
  const [dateRange, setDateRange] = useState('month');

  const receipts = useSelector((state) => state.receipts.userReceipts.filter(FILTERS[dateRange]));

  // do kategorii i tagów można też dodać te wykresy liniowe jak się zmieniały w czasie wydatki dla kategorii
  // tylko trzeba tam gdzieś wcisnąć wybór kategorii XD np tam na dole byłby spoko i go jakoś zaznaczyć ale tylko przy tamtym widoku?

  const total = receipts.reduce((acc, receipt) => acc + receipt.total, 0);
  const data = getData(receipts, total, mode, dateRange);

  const categoriesCharts = (
    <Pages style={styles.pages} indicatorColor={Colors.primary}>
      <View style={styles.flexOne}>
        <PieChart data={data} hasData={!isEmpty(receipts)} />
      </View>
      <View style={styles.flexOne}>
        <PolarChart data={data} />
      </View>
    </Pages>
  );

  const tagsCharts = <View></View>;

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
    if (mode === 'categories') {
      return categoriesCharts;
    } else if (mode === 'tags') {
      return tagsCharts;
    }
    return summaryCharts;
  };

  return (
    <View style={styles.flexOne}>
      <BasicReceiptsFiltering dateRange={dateRange} setDateRange={setDateRange} />
      <ModePicker mode={mode} setMode={setMode} />
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
});

export default StatsScreen;
