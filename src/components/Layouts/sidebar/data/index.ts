import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "منوی اصلی",
    items: [
      {
        title: "داشبورد",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "‌ریکوردها",
        url: "/fuel-records",
        icon: Icons.FourCircle,
        items: [],
      },{
        title: "لوکوموتیو‌ها",
        url: "/vagons",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "تنظیمات",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
