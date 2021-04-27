import React from "react";
import { ScrollView, FlatList, View } from "react-native";

import { common, home } from "@styles";
import MainHeader from "@components/MainHeader";
import CategoriesBlock from "@components/HomeComponents/CategoriesBlock";
import { TEXTS, COLORS } from "@constants";
import SeeAllBtn from "@components/HomeComponents/SeeAllBtn";

const HomeScreen = (): JSX.Element => {
  interface Categories {
    [index: number]: {
      id: number;
      text: string;
      borderColor: any[];
    };
  }

  const categoriesData: Categories = [
    {
      id: 0,
      text: TEXTS.CATEGORIES.VEHICLE,
      borderColor: [COLORS.BORDER_VEHICLE],
    },
    {
      id: 1,
      text: TEXTS.CATEGORIES.ACCOMMODATION,
      borderColor: [
        COLORS.BORDER_ACCOMODATION_GREEN,
        COLORS.BORDER_ACCOMODATION_PURPLE,
      ],
    },
    {
      id: 2,
      text: TEXTS.CATEGORIES.ELECTRONICS,
      borderColor: [COLORS.LIGHT_SILVER],
    },
    {
      id: 3,
      text: TEXTS.CATEGORIES.OTHER,
      borderColor: [COLORS.BORDER_OTHER],
    },
  ];

  const renderData = (item: any) => (
    <CategoriesBlock text={item.text} borderColor={item.borderColor} />
  );

  return (
    <ScrollView style={[common.main, common.mainBackground]}>
      <MainHeader title={{ text: TEXTS.HOME_PAGE_TITLE }} />
      <View style={[home.categories, common.boxShadow]}>
        <FlatList
          numColumns={categoriesData?.length / 2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={categoriesData}
          renderItem={({ item }) => {
            return renderData(item);
          }}
        />
        <SeeAllBtn />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
