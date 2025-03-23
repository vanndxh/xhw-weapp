import { View, Image } from "@tarojs/components";
import { GachaType, GachaTypeKey, roleList } from "../../constants";
import styles from "./index.module.less";

interface GoldTotalProps {
  type: GachaTypeKey;
  data: ObjectType[];
}

const GoldTotal = (props: GoldTotalProps) => {
  const { type, data } = props;

  return (
    <View className={styles.goldTotal}>
      <View className={styles.title}>{GachaType[type].label}</View>

      <View className={styles.listContainer}>
        {data.map((item, index) => {
          const role = roleList.find((r) => r.name === item.name);
          return (
            <View key={index} className={styles.listItem}>
              {role ? (
                <Image
                  className={styles.roleImage}
                  src={`https://t1.xianx.com.cn/xstatic/img/c/s/${role.englishName}.jpg`}
                  mode="aspectFit"
                />
              ) : null}
              <View className={styles.itemName}>{item.name}</View>
              <View
                className={styles.itemCount}
                style={{ color: role?.isNormal ? "red" : "blue" }}
              >
                {item.count}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default GoldTotal;
