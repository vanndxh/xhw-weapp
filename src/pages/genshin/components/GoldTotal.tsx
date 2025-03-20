import { View, Text } from "@tarojs/components";
import "./GoldTotal.less";

interface GoldTotalProps {
  isRole: boolean;
  data: Array<{
    name: string;
    count: number;
    gacha_type: string;
  }>;
}

export default function GoldTotal({ isRole, data }: GoldTotalProps) {
  return (
    <View className="gold-total">
      {data.map((item, index) => (
        <View key={index} className="gold-total-item">
          <Text className="gold-total-item-name">{item.name}</Text>
          <Text className="gold-total-item-count">{item.count}</Text>
        </View>
      ))}
    </View>
  );
}
