import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

import { categoriesBlockStyle } from "@styles";
import Text from "@components/Global/Text";
import useRenderLogo from "@hooks/useRenderLogo";

interface Categories {
  text: string;
  borderColor?: any[];
}

const CategoriesBlock = ({ text, borderColor }: Categories): JSX.Element => {
  const navigation: any = useNavigation();

  return (
    <LinearGradient
      colors={borderColor}
      style={categoriesBlockStyle.border}
      angle={95}
      start={{ x: 0.0, y: 0.9 }}
      locations={borderColor?.length > 1 ? undefined : [0]}
    >
      <TouchableOpacity
        style={[categoriesBlockStyle.container]}
        onPress={() => navigation.navigate("ListPage")}
      >
        {useRenderLogo(text)}
        <Text.Bold style={categoriesBlockStyle.text}>{text}</Text.Bold>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CategoriesBlock;
