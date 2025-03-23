import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";

import "./index.less";

export default function Index() {
  const handleGenshinRecord = () => {
    Taro.navigateTo({
      url: "/pages/genshin/index",
    });
  };

  const handleGithub = () => {
    Taro.setClipboardData({
      data: "https://github.com/vanndxh",
      success: () => {
        Taro.showToast({
          title: "链接已复制",
          icon: "success",
        });
      },
    });
  };

  const handleMail = () => {
    Taro.setClipboardData({
      data: "1025196468@qq.com",
      success: () => {
        Taro.showToast({
          title: "邮箱已复制",
          icon: "success",
        });
      },
    });
  };

  return (
    <View className="index">
      <View className="card" onClick={handleGenshinRecord}>
        原神抽卡记录导出
      </View>
      <View className="card-row">
        <View className="small-card github-card" onClick={handleGithub}>
          GitHub
        </View>
        <View className="small-card mail-card" onClick={handleMail}>
          QQ Mail
          <Text className="mail-address">1025196468@qq.com</Text>
        </View>
      </View>
    </View>
  );
}
