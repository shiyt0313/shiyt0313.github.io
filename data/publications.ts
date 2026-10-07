export type Publication = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  paper?: string;
  code?: string;
  project?: string;
  bibtex?: string;
  selected?: boolean;
  authorNote?: string;
};

// Published papers from Yingtian Shi's Google Scholar profile.
const entries: Array<[string, string, string, number, string, string, string?]> = [
  [
    "TRACE: Temporal Reasoning over Context and Evidence for Activity Recognition in Smart Homes",
    "Yingtian Shi, Abivishaq Balasubramanian, Jessica Herring, Jiachen Li, Juan Macias Romero, Rosemarie Santa Gonzalez, Varun Mishra, Agata Rozga, Xiang Zhi Tan, Thomas Plötz",
    "ACM IMWUT", 2026, "https://arxiv.org/abs/2605.02841", "/projects/trace"
  ],
  [
    "EduGage: Methods and Dataset for Sensor-Based Momentary Assessment of Engagement in Self-Guided Video Learning",
    "Zikang Leng, Edan Eyal, Yingtian Shi, Jiaman He, Yaqi Liu, Thomas Plötz",
    "ACM IMWUT", 2026, "https://arxiv.org/abs/2605.01238", "/projects/edugage"
  ],
  [
    "Towards More Equitable Ulcer Recognition Models: A Dataset of Naturalistic Foot Images from People of Color Living with Diabetes",
    "Cynthia M Baseman*, Yingtian Shi*, Zikang Leng, Yaqi Liu, Gabriel Santamarina, Marcos C Schechter, Maya Fayfman, Thomas Ploetz, Rosa I Arriaga",
    "IEEE BHI", 2025, "https://ieeexplore.ieee.org/abstract/document/11269467/", "/projects/equitable-diabetic-foot-ulcer-recognition",
    "* Equal contribution (co-first authors)."
  ],
  [
    "Geniewizard: Multimodal app feature discovery with large language models",
    "Jackie Yang, Yingtian Shi, Chris Gu, Zhang Zheng, Anisha Jain, Tianshi Li, Monica S Lam, James A Landay",
    "ACM CHI", 2025, "https://dl.acm.org/doi/abs/10.1145/3706598.3714327", "/projects/geniewizard"
  ],
  [
    "Enhancing smartphone eye tracking with cursor-based interactive implicit calibration",
    "Chang Liu, Xiangyang Wang, Chun Yu, Yingtian Shi, Chongyang Wang, Ziqi Liu, Chen Liang, Yuanchun Shi",
    "ACM CHI", 2025, "https://dl.acm.org/doi/abs/10.1145/3706598.3713936", "/projects/cometic"
  ],
  [
    "ReactGenie: A development framework for complex multimodal interactions using large language models",
    "Jackie Yang, Yingtian Shi, Yuhan Zhang, Karina Li, Daniel Wan Rosli, Anisha Jain, Shuning Zhang, Tianshi Li, James A Landay, Monica S Lam",
    "ACM CHI", 2024, "https://dl.acm.org/doi/abs/10.1145/3613904.3642517", "/projects/reactgenie"
  ],
  [
    "Calibread: Unobtrusive eye tracking calibration from natural reading behavior",
    "Change Liu, Chun Yu, Xiangyang Wang, Jianxiao Jiang, Tiaoao Yang, Bingda Tang, Yingtian Shi, Chen Liang, Yuanchun Shi",
    "ACM IMWUT", 2024, "https://dl.acm.org/doi/abs/10.1145/3699737", "/projects/calibread"
  ],
  [
    "Understanding in-situ programming for smart home automation",
    "Xiaoyi Liu*, Yingtian Shi*, Chun Yu, Cheng Gao, Tianao Yang, Chen Liang, Yuanchun Shi",
    "ACM IMWUT", 2023, "https://dl.acm.org/doi/abs/10.1145/3596254", "/projects/smart-home-in-situ-programming",
    "* Equal contribution (co-first authors)."
  ],
  [
    "Conespeech: Exploring directional speech interaction for multi-person remote communication in virtual reality",
    "Yukang Yan, Haohua Liu, Yingtian Shi, Jingying Wang, Ruici Guo, Zisu Li, Xuhai Xu, Chun Yu, Yuntao Wang, Yuanchun Shi",
    "IEEE TVCG", 2023, "https://ieeexplore.ieee.org/abstract/document/10049667/", "/projects/conespeech"
  ],
  [
    "Facesight: Enabling hand-to-face gesture interaction on ar glasses with a downward-facing camera vision",
    "Yueting Weng, Chun Yu, Yingtian Shi, Yuhang Zhao, Yukang Yan, Yuanchun Shi",
    "ACM CHI", 2021, "https://dl.acm.org/doi/abs/10.1145/3411764.3445484", "/projects/facesight"
  ],
  [
    "Headcross: Exploring head-based crossing selection on head-mounted displays",
    "Yukang Yan*, Yingtian Shi*, Chun Yu, Yuanchun Shi",
    "ACM IMWUT", 2020, "https://dl.acm.org/doi/abs/10.1145/3380983", "/projects/headcross",
    "* Equal contribution (co-first authors)."
  ],
  [
    "Privatetalk: Activating voice input with hand-on-mouth gesture detected by bluetooth earphones",
    "Yukang Yan, Chun Yu, Yingtian Shi, Minxing Xie",
    "ACM UIST", 2019, "https://dl.acm.org/doi/abs/10.1145/3332165.3347950", "/projects/privatetalk"
  ]
];

export const publications: Publication[] = entries.map(([title, authors, venue, year, paper, project, authorNote]) => ({
  title,
  authors: authors.split(", "),
  venue,
  year,
  paper,
  project,
  authorNote
}));
