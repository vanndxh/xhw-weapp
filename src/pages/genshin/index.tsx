import { View, Input, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { GachaType, GachaTypeKey } from "./constants";
import GoldTotal from "./components/GoldTotal";
import "./index.less";

export default function Genshin() {
  const initGachaParams = {
    endId: "0",
    currentPage: 1,
    gachaType: GachaTypeKey.ROLE,
  };

  const [gachaParams, setGachaParams] = useState<ObjectType | undefined>();
  const [tempData, setTempData] = useState<ObjectType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [allGoldData, setAllGoldData] = useState<ObjectType[]>([]);

  /** 接口请求操作 */
  const fetchData = async () => {
    if (!gachaParams) return;

    Taro.showLoading({
      title: `获取${GachaType[gachaParams.gachaType].label}池第${
        gachaParams.currentPage
      }页中...`,
    });

    const token = inputValue?.split("?")?.[1].split("#")?.[0];
    const params = {
      gacha_type: GachaType[gachaParams.gachaType].code,
      page: gachaParams.currentPage,
      size: 20,
      end_id: gachaParams.endId,
    };
    const queryString = Object.keys(params)
      .map((i) => `&${i}=${params[i]}`)
      .join("");
    const fetchUrl = `/api/mihoyo/gacha_info/api/getGachaLog?${token}${queryString}`;

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
        setLoading(false);
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
        setLoading(false);
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
      setLoading(false);
    } finally {
      Taro.hideLoading();
    }
  };

  useEffect(() => {
    if (gachaParams) {
      const timer = setTimeout(fetchData, 500);
      return () => clearTimeout(timer);
    }
  }, [gachaParams]);

  return (
    <View className="genshin">
      <View
        className="genshin-body"
        style={{ height: allGoldData.length ? "calc(100% - 120px)" : 0 }}
      >
        {Object.keys(GachaType).map((i) => (
          <View key={GachaType[i].code} className="genshin-body-item">
            <View className="genshin-body-item-title">
              {GachaType[i].label}
            </View>
            <GoldTotal
              isRole={GachaType[i].label === "角色"}
              data={
                allGoldData?.filter((j) => {
                  if (GachaType[i].label === "角色") {
                    return ["301", "400"].includes(j.gacha_type);
                  }
                  return j.gacha_type === GachaType[i].code;
                }) as any
              }
            />
          </View>
        ))}
      </View>

      <View
        className="genshin-input-line"
        style={{ bottom: allGoldData.length ? 0 : "50%" }}
      >
        <View
          className="input-container"
          style={{ width: allGoldData.length ? "100%" : "90%" }}
        >
          <Button
            className="genshin-button"
            onClick={() => Taro.navigateToMiniProgram({ appId: "wx123456789" })}
          >
            原神，启动！
          </Button>

          <Input
            className="genshin-input"
            placeholder="请输入导出链接"
            value={inputValue}
            onInput={(e) => setInputValue(e.detail.value)}
            disabled={loading}
          />

          {inputValue ? (
            <Button
              className="genshin-button"
              onClick={() => {
                setLoading(true);
                setAllGoldData([]);
                setGachaParams(initGachaParams);
              }}
              loading={loading}
            >
              开始获取
            </Button>
          ) : (
            <Button
              className="genshin-button"
              onClick={() => {
                Taro.showModal({
                  title: "如何获取导出链接？",
                  content:
                    "1、打开游戏抽卡记录页面，最好多翻几页\n2、打开电脑终端 windows powershell\n3、输入 iex(irm 'https://img.lelaer.com/cn.ps1')\n4、命令运行结束时链接已经自动复制到剪贴板，直接使用即可",
                  showCancel: false,
                });
              }}
            >
              如何获得？
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
