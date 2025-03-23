import { View, Input, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";

import GoldTotal from "./components/GoldTotal";
import { GachaType, GachaTypeKey } from "./constants";

import styles from "./index.module.less";

export default function Genshin() {
  const initGachaParams = {
    endId: "0",
    currentPage: 1,
    gachaType: GachaTypeKey.ROLE,
  };

  const [gachaParams, setGachaParams] = useState<ObjectType | undefined>();
  const [tempData, setTempData] = useState<ObjectType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [allGoldData, setAllGoldData] = useState<ObjectType[]>([]);

  /** 接口请求操作 */
  const fetchData = async () => {
    if (!gachaParams) return;

    const token = inputValue?.split("?")?.[1]?.split("#")?.[0];
    if (!token) {
      Taro.showToast({
        title: "请输入正确的导出链接",
        icon: "error",
      });
      return;
    }

    Taro.showToast({
      title: `获取${GachaType[gachaParams.gachaType].label}池第${
        gachaParams.currentPage
      }页中...`,
      icon: "loading",
      mask: true,
    });

    const params = {
      gacha_type: GachaType[gachaParams.gachaType].code,
      page: gachaParams.currentPage,
      size: 20,
      end_id: gachaParams.endId,
    };
    const queryString = Object.keys(params)
      .map((i) => `&${i}=${params[i]}`)
      .join("");
    const fetchUrl = `https://public-operation-hk4e.mihoyo.com/gacha_info/api/getGachaLog?${token}${queryString}`;

    try {
      const res = await Taro.request({
        url: fetchUrl,
        method: "GET",
      });

      if (!res?.data?.data) {
        Taro.showToast({
          title: res?.data?.message || "请求失败",
          icon: "error",
        });
        return;
      }

      if (res.data.data.list.length) {
        setGachaParams({
          ...gachaParams,
          endId: res?.data?.data?.list[res.data.data.list.length - 1]?.id || "",
          currentPage: gachaParams.currentPage + 1,
        });
        setTempData([...tempData, ...res?.data?.data?.list]);
        return;
      }

      const gachaList = Object.keys(GachaType);
      const curIndex = gachaList.findIndex((i) => i === gachaParams.gachaType);
      const nextGacha = gachaList[curIndex + 1] || gachaList[0];

      const handleRawData = (rawData) => {
        return rawData?.reduce((acc, current) => {
          if (current.rank_type === "5") {
            acc.push({
              name: current.name,
              count: 1,
              gacha_type: current.gacha_type,
            });
          } else {
            if (acc.length === 0) {
              acc.push({
                name: "已垫",
                count: 0,
                gacha_type: rawData[0]?.gacha_type,
              });
            }
            acc[acc.length - 1].count += 1;
          }
          return acc;
        }, []);
      };

      setAllGoldData((prev) => [...prev, ...handleRawData(tempData)]);
      setTempData([]);

      if (curIndex === gachaList?.length - 1) {
        setGachaParams(undefined);
        Taro.showToast({
          title: "获取成功！",
          icon: "success",
        });
      } else {
        setGachaParams({
          gachaType: nextGacha as GachaTypeKey,
          endId: "0",
          currentPage: 1,
        });
      }
    } catch (error) {
      Taro.showToast({
        title: "请求失败",
        icon: "error",
      });
    }
  };

  const getFilteredData = (type: GachaTypeKey) => {
    return allGoldData?.filter((j) => {
      if (GachaType[type].label === "角色") {
        return ["301", "400"].includes(j.gacha_type);
      }
      return j.gacha_type === GachaType[type].code;
    });
  };

  useEffect(() => {
    if (gachaParams) {
      const timer = setTimeout(fetchData, 500);
      return () => clearTimeout(timer);
    }
  }, [gachaParams]);

  return (
    <View className={styles.genshin}>
      {/** 数据展示 */}
      {allGoldData.length ? (
        <View className={styles.genshinBody}>
          {Object.keys(GachaType).map((i) => {
            const data = getFilteredData(i as GachaTypeKey);
            return data?.length ? (
              <GoldTotal key={i} type={i as GachaTypeKey} data={data} />
            ) : null;
          })}
        </View>
      ) : null}

      {/** 输入框 */}
      <View
        className={styles.inputContainer}
        style={{ bottom: allGoldData.length ? "1.2rem" : "50%" }}
      >
        <Input
          className={styles.genshinInput}
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
          placeholder="请输入导出链接"
          maxlength={-1}
        />

        {inputValue ? (
          <Button
            className={styles.genshinButton}
            onClick={() => {
              setAllGoldData([]);
              setGachaParams(initGachaParams);
            }}
          >
            开始获取
          </Button>
        ) : (
          <Button
            className={styles.genshinButton}
            onClick={() => {
              Taro.showModal({
                title: "如何获取导出链接？",
                content: `
1、打开游戏抽卡记录页面，最好多翻几页
2、打开电脑终端 windows powershell
3、输入 iex(irm 'https://img.lelaer.com/cn.ps1')
4、命令运行结束时链接已经自动复制到剪贴板，直接使用即可
`,
                showCancel: false,
              });
            }}
          >
            如何获得？
          </Button>
        )}
      </View>
    </View>
  );
}
