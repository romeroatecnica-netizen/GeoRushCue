import type { GeoItem } from '../types/game';

export const RIVERS_BANK: GeoItem[] = [
  {
    id: 'riv_amazon',
    category: 'rivers',
    region: 'americas',
    lat: -3.1,
    lon: -60.0,
    riverPath: [
      [-10.5, -76.2],
      [-4.4, -73.5],
      [-3.1, -60.0],
      [-2.4, -54.7],
      [-0.2, -49.8]
    ],
    translations: {
      en: {
        name: 'Amazon River',
        clues: [
          'The largest river on Earth by water discharge volume.',
          'Flows eastward across South America from the Peruvian Andes to the Atlantic.',
          'Meanders through the world’s largest tropical rainforest, mostly in Brazil.'
        ]
      },
      es: {
        name: 'Río Amazonas',
        clues: [
          'El río más caudaloso de la Tierra por volumen de agua.',
          'Fluye hacia el este desde los Andes peruanos hasta el océano Atlántico.',
          'Recorre la selva tropical más extensa del planeta, mayormente en Brasil.'
        ]
      },
      fr: {
        name: 'Amazone',
        clues: [
          'Le plus puissant fleuve de la Terre par son débit d’eau.',
          'Il coule d’ouest en est des Andes péruviennes jusqu’à l’Atlantique.',
          'Il traverse la plus vaste forêt tropicale du monde, surtout au Brésil.'
        ]
      },
      de: {
        name: 'Amazonas',
        clues: [
          'Der wasserreichste Fluss der Erde nach Abflussmenge.',
          'Fließt von den peruanischen Anden ostwärts in den Atlantik.',
          'Durchströmt den größten tropischen Regenwald der Welt, großteils in Brasilien.'
        ]
      },
      pt: {
        name: 'Rio Amazonas',
        clues: [
          'O maior rio da Terra em volume de vazão de água.',
          'Corre de oeste para leste dos Andes peruanos até o Atlântico.',
          'Atravessa a maior floresta tropical do mundo, sobretudo no Brasil.'
        ]
      },
      ar: {
        name: 'نهر الأمازون',
        clues: [
          'أكبر أنهار الأرض من حيث حجم التدفق المائي.',
          'يتدفق شرقاً عبر أمريكا الجنوبية من جبال الأنديز إلى المحيط الأطلسي.',
          'يعبر أكبر غابة مطيرة استوائية في العالم ومعظمه في البرازيل.'
        ]
      },
      hi: {
        name: 'अमेज़न नदी',
        clues: [
          'जल प्रवाह की मात्रा के हिसाब से पृथ्वी की सबसे बड़ी नदी।',
          'पेरू के एंडीज़ से पूर्व की ओर बहकर अटलांटिक महासागर में मिलती है।',
          'दुनिया के सबसे बड़े उष्णकटिबंधीय वर्षावन से होकर मुख्यतः ब्राज़ील में बहती है।'
        ]
      },
      ru: {
        name: 'Река Амазонка',
        clues: [
          'Самая полноводная река Земли по объёму стока.',
          'Течёт на восток от перуанских Анд к Атлантическому океану.',
          'Протекает через крупнейший тропический лес мира, в основном по Бразилии.'
        ]
      },
      zh: {
        name: '亚马孙河',
        clues: [
          '地球上径流量最大的河流。',
          '发源于秘鲁安第斯山脉，向东横穿南美洲注入大西洋。',
          '蜿蜒流经世界最大的热带雨林，主要位于巴西境内。'
        ]
      },
      ja: {
        name: 'アマゾン川',
        clues: [
          '流域面積と流量が地球上で最大の川です。',
          'ペルーのアンデス山脈から東へ流れ、大西洋に注ぎます。',
          '世界最大の熱帯雨林を貫き、その大半はブラジル国内を流れます。'
        ]
      }
    }
  },
  {
    id: 'riv_nile',
    category: 'rivers',
    region: 'africa',
    lat: 15.6,
    lon: 32.5,
    riverPath: [
      [-1.0, 32.5],
      [9.5, 31.6],
      [15.6, 32.5],
      [25.7, 32.6],
      [31.2, 31.2]
    ],
    translations: {
      en: {
        name: 'Nile River',
        clues: [
          'A major north-flowing river stretching over 6,650 km across northeastern Africa.',
          'Formed by the confluence of the White and Blue tributaries in Khartoum.',
          'Empties into the Mediterranean Sea through a wide delta north of Cairo.'
        ]
      },
      es: {
        name: 'Río Nilo',
        clues: [
          'Gran río que fluye hacia el norte más de 6.650 km por el noreste africano.',
          'Se forma en Jartum al unirse sus dos brazos principales: Blanco y Azul.',
          'Desemboca en el Mediterráneo mediante un amplio delta al norte de El Cairo.'
        ]
      },
      fr: {
        name: 'Nil',
        clues: [
          'Grand fleuve coulant vers le nord sur plus de 6 650 km en Afrique du Nord-Est.',
          'Né de la confluence de ses branches blanche et bleue à Khartoum.',
          'Se jette dans la Méditerranée par un vaste delta au nord du Caire.'
        ]
      },
      de: {
        name: 'Nil',
        clues: [
          'Über 6.650 km langer Strom, der nordwärts durch Nordostafrika fließt.',
          'Entsteht in Khartum aus dem Zusammenfluss von Weißem und Blauem Arm.',
          'Mündet über ein breites Delta nördlich von Kairo ins Mittelmeer.'
        ]
      },
      pt: {
        name: 'Rio Nilo',
        clues: [
          'Grande rio que corre para o norte por mais de 6.650 km no nordeste da África.',
          'Forma-se em Cartum na junção dos braços Branco e Azul.',
          'Deságua no Mar Mediterrâneo por um amplo delta ao norte do Cairo.'
        ]
      },
      ar: {
        name: 'نهر النيل',
        clues: [
          'نهر عظيم يتدفق شمالاً لأكثر من 6650 كيلومتراً في شمال شرق أفريقيا.',
          'يتكون من التقاء رافديه الأبيض والأزرق عند مدينة الخرطوم.',
          'يصب في البحر المتوسط عبر دلتا واسعة شمال القاهرة.'
        ]
      },
      hi: {
        name: 'नील नदी',
        clues: [
          'उत्तर-पूर्वी अफ्रीका में 6,650 किमी से अधिक उत्तर की ओर बहने वाली प्रमुख नदी।',
          'खार्तूम में श्वेत और नीली धाराओं के संगम से बनती है।',
          'काहिरा के उत्तर में एक विशाल डेल्टा बनाकर भूमध्य सागर में गिरती है।'
        ]
      },
      ru: {
        name: 'Река Нил',
        clues: [
          'Великая река длиной свыше 6650 км, текущая на север по Северо-Восточной Африке.',
          'Образуется в Хартуме слиянием Белого и Голубого притоков.',
          'Впадает в Средиземное море широкой дельтой к северу от Каира.'
        ]
      },
      zh: {
        name: '尼罗河',
        clues: [
          '流经非洲东北部、向北绵延6650多公里的大河。',
          '在喀土穆由白支流与青支流汇合而成。',
          '在开罗以北形成广阔三角洲注入地中海。'
        ]
      },
      ja: {
        name: 'ナイル川',
        clues: [
          '北東アフリカを6,650km以上にわたり北へ流れる大河です。',
          'ハルツームで白ナイルと青ナイルが合流して形成されます。',
          'カイロの北で広いデルタを作って地中海に注ぎます。'
        ]
      }
    }
  },
  {
    id: 'riv_danube',
    category: 'rivers',
    region: 'europe',
    lat: 47.5,
    lon: 19.0,
    riverPath: [
      [48.1, 8.5],
      [48.2, 16.3],
      [47.5, 19.0],
      [44.8, 20.4],
      [45.1, 29.6]
    ],
    translations: {
      en: {
        name: 'Danube River',
        clues: [
          'Flows through more countries (ten) than any other river on Earth.',
          'Rises in Germany’s Black Forest and empties into the Black Sea.',
          'Links four national capitals: Vienna, Bratislava, Budapest, and Belgrade.'
        ]
      },
      es: {
        name: 'Río Danubio',
        clues: [
          'Atraviesa más países (diez) que cualquier otro río del mundo.',
          'Nace en la Selva Negra alemana y desemboca en el mar Negro.',
          'Conecta cuatro capitales: Viena, Bratislava, Budapest y Belgrado.'
        ]
      },
      fr: {
        name: 'Danube',
        clues: [
          'Traverse plus de pays (dix) que tout autre fleuve au monde.',
          'Prend sa source dans la Forêt-Noire et se jette dans la mer Noire.',
          'Relie quatre capitales : Vienne, Bratislava, Budapest et Belgrade.'
        ]
      },
      de: {
        name: 'Donau',
        clues: [
          'Durchfließt mehr Staaten (zehn) als jeder andere Fluss der Erde.',
          'Entspringt im Schwarzwald und mündet ins Schwarze Meer.',
          'Verbindet vier Hauptstädte: Wien, Bratislava, Budapest und Belgrad.'
        ]
      },
      pt: {
        name: 'Rio Danúbio',
        clues: [
          'Passa por mais países (dez) do que qualquer outro rio da Terra.',
          'Nasce na Floresta Negra alemã e deságua no Mar Negro.',
          'Banha quatro capitais: Viena, Bratislava, Budapeste e Belgrado.'
        ]
      },
      ar: {
        name: 'نهر الدانوب',
        clues: [
          'يعبر دولاً أكثر من أي نهر آخر على وجه الأرض (عشر دول).',
          'ينبع من الغابة السوداء في ألمانيا ويصب في البحر الأسود.',
          'يمر بأربع عواصم: فيينا وبراتيسلافا وبودابست وبلغراد.'
        ]
      },
      hi: {
        name: 'डेन्यूब नदी',
        clues: [
          'पृथ्वी की किसी भी अन्य नदी की तुलना में सर्वाधिक देशों (दस) से होकर बहती है।',
          'जर्मनी के ब्लैक फ़ॉरेस्ट से निकलकर काला सागर में गिरती है।',
          'चार राजधानियों—वियना, ब्रातिस्लावा, बुडापेस्ट और बेलग्रेड—से गुजरती है।'
        ]
      },
      ru: {
        name: 'Река Дунай',
        clues: [
          'Протекает по территории большего числа стран (десяти), чем любая другая река.',
          'Берёт начало в немецком Шварцвальде и впадает в Чёрное море.',
          'Соединяет четыре столицы: Вену, Братиславу, Будапешт и Белград.'
        ]
      },
      zh: {
        name: '多瑙河',
        clues: [
          '流经国家数量（十个）居世界所有河流之首。',
          '发源于德国黑森林，最终注入黑海。',
          '串联起维也纳、布拉迪斯拉发、布达佩斯和贝尔格莱德四座首都。'
        ]
      },
      ja: {
        name: 'ドナウ川',
        clues: [
          '世界で最も多くの国（10か国）を流れる国際河川です。',
          'ドイツのシュヴァルツヴァルトに源を発し、黒海に注ぎます。',
          'ウィーン、ブラチスラヴァ、ブダペスト、ベオグラードの4首都を通ります。'
        ]
      }
    }
  },
  {
    id: 'riv_yangtze',
    category: 'rivers',
    region: 'asia',
    lat: 30.6,
    lon: 114.3,
    riverPath: [
      [33.5, 91.5],
      [29.5, 106.5],
      [30.6, 114.3],
      [32.1, 118.8],
      [31.3, 121.8]
    ],
    translations: {
      en: {
        name: 'Yangtze River',
        clues: [
          'The longest river in Asia and the third-longest in the world.',
          'Flows from the Tibetan Plateau eastward to the East China Sea near Shanghai.',
          'Spanned by the Three Gorges Dam in central China.'
        ]
      },
      es: {
        name: 'Río Yangtsé',
        clues: [
          'El río más largo de Asia y el tercero del mundo.',
          'Fluye desde la meseta tibetana hasta el mar de China Oriental cerca de Shanghái.',
          'Alberga la presa de las Tres Gargantas en el centro de China.'
        ]
      },
      fr: {
        name: 'Yangtsé',
        clues: [
          'Le plus long fleuve d’Asie et le troisième du monde.',
          'Coule du plateau tibétain vers la mer de Chine orientale près de Shanghai.',
          'Barré par le célèbre barrage des Trois-Gorges en Chine centrale.'
        ]
      },
      de: {
        name: 'Jangtsekiang',
        clues: [
          'Der längste Fluss Asiens und der drittlängste der Welt.',
          'Fließt vom Tibetischen Hochland ostwärts bis nahe Shanghai.',
          'Wird in Zentralchina vom Drei-Schluchten-Damm gestaut.'
        ]
      },
      pt: {
        name: 'Rio Yangtzé',
        clues: [
          'O maior rio da Ásia e o terceiro mais longo do planeta.',
          'Corre do Planalto Tibetano até o Mar da China Oriental perto de Xangai.',
          'Abriga a Usina das Três Gargantas no centro da China.'
        ]
      },
      ar: {
        name: 'نهر اليانغتسي',
        clues: [
          'أطول أنهار قارة آسيا وثالث أطول أنهار العالم.',
          'يتدفق من هضبة التبت شرقاً ليصب قرب شنغهاي في بحر الصين الشرقي.',
          'يقع عليه سد الممرات الثلاثة في وسط الصين.'
        ]
      },
      hi: {
        name: 'यांग्त्ज़ी नदी',
        clues: [
          'एशिया की सबसे लंबी और दुनिया की तीसरी सबसे लंबी नदी।',
          'तिब्बती पठार से पूर्व की ओर बहकर शंघाई के पास पूर्वी चीन सागर में मिलती है।',
          'मध्य चीन में इस पर थ्री गॉर्जेस बांध बना हुआ है।'
        ]
      },
      ru: {
        name: 'Река Янцзы',
        clues: [
          'Самая длинная река Азии и третья по длине в мире.',
          'Течёт с Тибетского нагорья на восток к Восточно-Китайскому морю у Шанхая.',
          'На ней построена грандиозная плотина «Три ущелья» в Китае.'
        ]
      },
      zh: {
        name: '长江',
        clues: [
          '亚洲第一长河、世界第三长河。',
          '发源于青藏高原，向东在上海附近注入东海。',
          '干流上建有著名的三峡大坝。'
        ]
      },
      ja: {
        name: '長江',
        clues: [
          'アジア最長、世界で3番目に長い大河です。',
          'チベット高原から東へ流れ、上海付近で東シナ海に注ぎます。',
          '中流域に巨大な三峡ダムが建設されています。'
        ]
      }
    }
  },
  {
    id: 'riv_mississippi',
    category: 'rivers',
    region: 'americas',
    lat: 35.1,
    lon: -90.0,
    riverPath: [
      [47.2, -95.2],
      [41.5, -90.5],
      [38.6, -90.2],
      [35.1, -90.0],
      [29.1, -89.2]
    ],
    translations: {
      en: {
        name: 'Mississippi River',
        clues: [
          'North America’s chief drainage artery flowing from Minnesota to the Gulf of Mexico.',
          'Meets the Missouri and Ohio rivers along its southward journey.',
          'Passes St. Louis, Memphis, and New Orleans at its delta.'
        ]
      },
      es: {
        name: 'Río Misisipi',
        clues: [
          'Principal arteria fluvial de Norteamérica desde Minnesota al golfo de México.',
          'Recibe las aguas de los ríos Misuri y Ohio rumbo al sur.',
          'Pasa por San Luis, Memphis y Nueva Orleans en su delta.'
        ]
      },
      fr: {
        name: 'Mississippi',
        clues: [
          'Principal fleuve d’Amérique du Nord du Minnesota au golfe du Mexique.',
          'Reçoit les eaux du Missouri et de l’Ohio dans sa course vers le sud.',
          'Borde Saint-Louis, Memphis et La Nouvelle-Orléans.'
        ]
      },
      de: {
        name: 'Mississippi',
        clues: [
          'Hauptstrom Nordamerikas von Minnesota bis zum Golf von Mexiko.',
          'Nimmt auf seinem Weg nach Süden den Missouri und den Ohio auf.',
          'Fließt an St. Louis, Memphis und New Orleans vorbei.'
        ]
      },
      pt: {
        name: 'Rio Mississippi',
        clues: [
          'Principal artéria fluvial da América do Norte, de Minnesota ao Golfo do México.',
          'Recebe as águas dos rios Missouri e Ohio rumo ao sul.',
          'Passa por St. Louis, Memphis e Nova Orleans.'
        ]
      },
      ar: {
        name: 'نهر المسيسيبي',
        clues: [
          'الشريان النهري الرئيسي في أمريكا الشمالية من مينيسوتا إلى خليج المكسيك.',
          'يلتقي بنهري ميزوري وأوهايو خلال جريانه جنوباً.',
          'يمر بمدن سانت لويس وممفيس ونيو أورلينز.'
        ]
      },
      hi: {
        name: 'मिसिसिपी नदी',
        clues: [
          'मिनेसोटा से मेक्सिको की खाड़ी तक बहने वाली उत्तरी अमेरिका की प्रमुख नदी।',
          'दक्षिण की ओर बढ़ते हुए मिसौरी और ओहायो नदियों से मिलती है।',
          'सेंट लुइस, मेम्फिस और न्यू ऑरलियन्स इसके किनारे बसे हैं।'
        ]
      },
      ru: {
        name: 'Река Миссисипи',
        clues: [
          'Главная речная артерия Северной Америки от Миннесоты до Мексиканского залива.',
          'По пути на юг принимает притоки Миссури и Огайо.',
          'Протекает мимо Сент-Луиса, Мемфиса и Нового Орлеана.'
        ]
      },
      zh: {
        name: '密西西比河',
        clues: [
          '从明尼苏达州流向墨西哥湾的北美洲主干河流。',
          '向南奔流途中接纳密苏里河与俄亥俄河。',
          '流经圣路易斯、孟菲斯与新奥尔良三角洲。'
        ]
      },
      ja: {
        name: 'ミシシッピ川',
        clues: [
          'ミネソタ州からメキシコ湾へと南下する北米最大の水系です。',
          '途中でミズーリ川やオハイオ川と合流します。',
          'セントルイス、メンフィス、ニューオーリンズを通過します。'
        ]
      }
    }
  },
  {
    id: 'riv_rhine',
    category: 'rivers',
    region: 'europe',
    lat: 50.3,
    lon: 7.6,
    riverPath: [
      [46.6, 8.7],
      [47.5, 7.6],
      [50.0, 8.2],
      [50.9, 6.9],
      [51.9, 4.1]
    ],
    translations: {
      en: {
        name: 'Rhine River',
        clues: [
          'One of Europe’s busiest commercial waterways flowing northward to the North Sea.',
          'Originates in the Swiss Alps and passes Lake Constance and Basel.',
          'Carves through castles in western Germany before reaching Rotterdam.'
        ]
      },
      es: {
        name: 'Río Rin',
        clues: [
          'Una de las vías fluviales más transitadas de Europa hacia el mar del Norte.',
          'Nace en los Alpes suizos y pasa por el lago de Constanza y Basilea.',
          'Cruza el oeste de Alemania entre castillos hasta desembocar en Róterdam.'
        ]
      },
      fr: {
        name: 'Rhin',
        clues: [
          'L’une des voies navigables les plus fréquentées d’Europe vers la mer du Nord.',
          'Prend sa source dans les Alpes suisses et traverse le lac de Constance.',
          'Longe châteaux et vignobles d’Allemagne jusqu’à Rotterdam.'
        ]
      },
      de: {
        name: 'Rhein',
        clues: [
          'Eine der verkehrsreichsten Wasserstraßen Europas zur Nordsee.',
          'Entspringt in den Schweizer Alpen und passiert den Bodensee und Basel.',
          'Zieht an Burgen Westdeutschlands vorbei bis nach Rotterdam.'
        ]
      },
      pt: {
        name: 'Rio Reno',
        clues: [
          'Uma das hidrovias mais movimentadas da Europa rumo ao Mar do Norte.',
          'Nasce nos Alpes Suíços e passa pelo Lago de Constança e Basileia.',
          'Atravessa castelos no oeste da Alemanha até Roterdã.'
        ]
      },
      ar: {
        name: 'نهر الراين',
        clues: [
          'أحد أكثر الممرات المائية التجارية ازدحاماً في أوروبا نحو بحر الشمال.',
          'ينبع من جبال الألب السويسرية ويمر ببحيرة كونستانس وبازل.',
          'يعبر قلاع غرب ألمانيا قبل أن يصل إلى ميناء روتردام.'
        ]
      },
      hi: {
        name: 'राइन नदी',
        clues: [
          'उत्तरी सागर की ओर बहने वाला यूरोप का सबसे व्यस्त व्यापारिक जलमार्ग।',
          'स्विस आल्प्स से निकलकर कॉन्स्टेंस झील और बेसल से गुजरती है।',
          'पश्चिमी जर्मनी के किलों के पास से बहती हुई रॉटरडैम पहुँचती है।'
        ]
      },
      ru: {
        name: 'Река Рейн',
        clues: [
          'Одна из самых оживлённых водных артерий Европы на пути к Северному морю.',
          'Берёт начало в Швейцарских Альпах, проходит через Боденское озеро и Базель.',
          'Протекает мимо замков западной Германии к порту Роттердам.'
        ]
      },
      zh: {
        name: '莱茵河',
        clues: [
          '向北注入北海的欧洲最繁忙航运水道之一。',
          '发源于瑞士阿尔卑斯山，流经博登湖和巴塞尔。',
          '穿过德国西部城堡区，最终抵达鹿特丹入海。'
        ]
      },
      ja: {
        name: 'ライン川',
        clues: [
          '北海へと北上するヨーロッパ有数の国際水運路です。',
          'スイス・アルプスに発し、ボーデン湖やバーゼルを通ります。',
          'ドイツ西部の古城地帯を抜けてロッテルダムに達します。'
        ]
      }
    }
  },
  {
    id: 'riv_ganges',
    category: 'rivers',
    region: 'asia',
    lat: 25.3,
    lon: 83.0,
    riverPath: [
      [30.9, 79.0],
      [26.4, 80.3],
      [25.3, 83.0],
      [25.6, 85.1],
      [22.5, 89.8]
    ],
    translations: {
      en: {
        name: 'Ganges River',
        clues: [
          'A sacred transboundary river flowing across northern India and Bangladesh.',
          'Originates in the western Himalayas from the Gangotri Glacier.',
          'Passes Varanasi before merging with the Brahmaputra in the Sundarbans delta.'
        ]
      },
      es: {
        name: 'Río Ganges',
        clues: [
          'Río sagrado que recorre el norte de la India y Bangladés.',
          'Nace en el Himalaya occidental en el glaciar Gangotri.',
          'Pasa por Benarés antes de formar el gran delta de los Sundarbans.'
        ]
      },
      fr: {
        name: 'Gange',
        clues: [
          'Fleuve sacré traversant le nord de l’Inde et le Bangladesh.',
          'Prend sa source dans l’Himalaya occidental au glacier de Gangotri.',
          'Passe par Varanasi avant de former le delta des Sundarbans.'
        ]
      },
      de: {
        name: 'Ganges',
        clues: [
          'Heiliger Strom durch Nordindien und Bangladesch.',
          'Entspringt im westlichen Himalaya am Gangotri-Gletscher.',
          'Fließt an Varanasi vorbei und mündet im Sundarbans-Delta.'
        ]
      },
      pt: {
        name: 'Rio Ganges',
        clues: [
          'Rio sagrado que corta o norte da Índia e Bangladesh.',
          'Nasce no Himalaia ocidental, na geleira Gangotri.',
          'Passa por Varanasi antes de formar o delta de Sundarbans.'
        ]
      },
      ar: {
        name: 'نهر الغانج',
        clues: [
          'نهر مقدس يعبر شمال الهند وبنغلاديش.',
          'ينبع من جبال الهيمالايا الغربية عند نهر غانغوتري الجليدي.',
          'يمر بمدينة فاراناسي قبل أن يشكل دلتا سونداربانس.'
        ]
      },
      hi: {
        name: 'गंगा नदी',
        clues: [
          'उत्तरी भारत और बांग्लादेश में बहने वाली एक पवित्र नदी।',
          'पश्चिमी हिमालय में गंगोत्री ग्लेशियर से इसका उद्गम होता है।',
          'वाराणसी से होकर बहती है और सुंदरबन डेल्टा में ब्रह्मपुत्र से मिलती है।'
        ]
      },
      ru: {
        name: 'Река Ганг',
        clues: [
          'Священная река, протекающая по северу Индии и Бангладеш.',
          'Берёт начало в Западных Гималаях у ледника Ганготри.',
          'Проходит мимо Варанаси и образует дельту Сундарбан.'
        ]
      },
      zh: {
        name: '恒河',
        clues: [
          '流经印度北部和孟加拉国的神圣大河。',
          '发源于西喜马拉雅山脉的甘戈特里冰川。',
          '流经瓦拉纳西，最终在孙德尔本斯三角洲汇入大海。'
        ]
      },
      ja: {
        name: 'ガンジス川',
        clues: [
          'インド北部からバングラデシュを流れる聖なる大河です。',
          '西ヒマラヤのガンゴートリー氷河を源流とします。',
          'バラナシを通り、シュンドルボン・デルタで海に注ぎます。'
        ]
      }
    }
  },
  {
    id: 'riv_mekong',
    category: 'rivers',
    region: 'asia',
    lat: 15.1,
    lon: 105.8,
    riverPath: [
      [33.2, 94.5],
      [22.0, 100.8],
      [17.9, 102.6],
      [11.5, 104.9],
      [9.6, 106.5]
    ],
    translations: {
      en: {
        name: 'Mekong River',
        clues: [
          'Southeast Asia’s longest river, spanning six nations from Tibet to Vietnam.',
          'Forms long stretches of border between Myanmar, Laos, and Thailand.',
          'Flows past Phnom Penh before fanning into a fertile southern delta.'
        ]
      },
      es: {
        name: 'Río Mekong',
        clues: [
          'El río más largo del Sudeste Asiático, cruzando seis países desde el Tíbet.',
          'Sirve de frontera entre Myanmar, Laos y Tailandia.',
          'Pasa por Nom Pen antes de abrirse en su delta de Vietnam.'
        ]
      },
      fr: {
        name: 'Mékong',
        clues: [
          'Le plus long fleuve d’Asie du Sud-Est, traversant six pays depuis le Tibet.',
          'Matérialise la frontière entre le Myanmar, le Laos et la Thaïlande.',
          'Passe par Phnom Penh avant de former un vaste delta au Viêt Nam.'
        ]
      },
      de: {
        name: 'Mekong',
        clues: [
          'Längster Fluss Südostasiens durch sechs Länder von Tibet bis Vietnam.',
          'Bildet Grenzabschnitte zwischen Myanmar, Laos und Thailand.',
          'Fließt an Phnom Penh vorbei in ein fruchtbares Delta.'
        ]
      },
      pt: {
        name: 'Rio Mekong',
        clues: [
          'Maior rio do Sudeste Asiático, cruzando seis países do Tibete ao Vietnã.',
          'Forma fronteiras entre Mianmar, Laos e Tailândia.',
          'Passa por Phnom Penh antes de formar seu fértil delta.'
        ]
      },
      ar: {
        name: 'نهر ميكونغ',
        clues: [
          'أطول أنهار جنوب شرق آسيا ويمر بست دول من التبت إلى فيتنام.',
          'يشكل حدوداً طبيعية بين ميانمار ولاوس وتايلاند.',
          'يمر ببنوم بنه قبل أن يتفرع في دلتا خصبة بفيتنام.'
        ]
      },
      hi: {
        name: 'मेकांग नदी',
        clues: [
          'तिब्बत से वियतनाम तक छह देशों में बहने वाली दक्षिण-पूर्व एशिया की सबसे लंबी नदी।',
          'म्यांमार, लाओस और थाईलैंड के बीच सीमा बनाती है।',
          'नोम पेन्ह से गुजरते हुए दक्षिणी डेल्टा में फैलती है।'
        ]
      },
      ru: {
        name: 'Река Меконг',
        clues: [
          'Крупнейшая река Юго-Восточной Азии, пересекающая шесть стран от Тибета.',
          'Служит границей между Мьянмой, Лаосом и Таиландом.',
          'Протекает через Пномпень и образует дельту во Вьетнаме.'
        ]
      },
      zh: {
        name: '湄公河',
        clues: [
          '流经六个国家的东南亚第一长河，发源于青藏高原。',
          '构成了缅甸、老挝与泰国之间的多段天然边界。',
          '流经金边后在越南南部形成肥沃三角洲。'
        ]
      },
      ja: {
        name: 'メコン川',
        clues: [
          'チベットからベトナムまで6か国を流れる東南アジア最長の川です。',
          'ミャンマー・ラオス・タイの国境線の一部を形成します。',
          'プノンペンを通り、ベトナム南部の肥沃なデルタに注ぎます。'
        ]
      }
    }
  },
  {
    id: 'riv_congo',
    category: 'rivers',
    region: 'africa',
    lat: -1.5,
    lon: 18.0,
    riverPath: [
      [-10.5, 26.0],
      [0.5, 25.2],
      [2.1, 21.5],
      [-4.3, 15.3],
      [-6.0, 12.3]
    ],
    translations: {
      en: {
        name: 'Congo River',
        clues: [
          'The deepest measured river in the world and Africa’s second-longest.',
          'Its sweeping northern arc crosses the Equator twice.',
          'Separates the capitals Brazzaville and Kinshasa just before reaching the Atlantic.'
        ]
      },
      es: {
        name: 'Río Congo',
        clues: [
          'El río más profundo del mundo y el segundo más largo de África.',
          'Su gran arco norte cruza dos veces la línea del Ecuador.',
          'Separa las capitales Brazzaville y Kinsasa antes de llegar al Atlántico.'
        ]
      },
      fr: {
        name: 'Fleuve Congo',
        clues: [
          'Le fleuve le plus profond du monde et le deuxième plus long d’Afrique.',
          'Sa grande boucle coupe deux fois l’équateur.',
          'Sépare Brazzaville et Kinshasa avant de se jeter dans l’Atlantique.'
        ]
      },
      de: {
        name: 'Kongo',
        clues: [
          'Der tiefste gemessene Fluss der Erde und zweitlängste Fluss Afrikas.',
          'Sein großer Bogen überquert den Äquator zweimal.',
          'Trennt Brazzaville und Kinshasa vor der Mündung in den Atlantik.'
        ]
      },
      pt: {
        name: 'Rio Congo',
        clues: [
          'O rio mais profundo do mundo e o segundo maior da África.',
          'Sua grande curva cruza a linha do Equador duas vezes.',
          'Separa Brazzaville e Kinshasa antes de desaguar no Atlântico.'
        ]
      },
      ar: {
        name: 'نهر الكونغو',
        clues: [
          'أعمق أنهار العالم وثاني أطول نهر في قارة أفريقيا.',
          'يقطع قوسه الكبير خط الاستواء مرتين.',
          'يفصل بين عاصمتي برازافيل وكينشاسا قبل مصبه في الأطلسي.'
        ]
      },
      hi: {
        name: 'कांगो नदी',
        clues: [
          'दुनिया की सबसे गहरी नदी और अफ्रीका की दूसरी सबसे लंबी नदी।',
          'इसका विशाल घुमाव भूमध्य रेखा को दो बार पार करता है।',
          'ब्राज़ाविल और किंशासा राजधानियों को अलग करते हुए अटलांटिक में मिलती है।'
        ]
      },
      ru: {
        name: 'Река Конго',
        clues: [
          'Самая глубокая река мира и вторая по длине в Африке.',
          'Её огромная дуга дважды пересекает экватор.',
          'Разделяет столицы Браззавиль и Киншасу перед впадением в Атлантику.'
        ]
      },
      zh: {
        name: '刚果河',
        clues: [
          '世界上最深的河流，也是非洲第二长河。',
          '其巨大的弧形河道两次穿越赤道。',
          '在注入大西洋前分隔布拉柴维尔与金沙萨两座首都。'
        ]
      },
      ja: {
        name: 'コンゴ川',
        clues: [
          '世界で最も水深が深く、アフリカで2番目に長い川です。',
          '大きな弧を描いて赤道を2度横切ります。',
          '大西洋に注ぐ手前でブラザビルとキンシャサを隔てています。'
        ]
      }
    }
  },
  {
    id: 'riv_murray',
    category: 'rivers',
    region: 'oceania',
    lat: -34.2,
    lon: 142.1,
    riverPath: [
      [-36.5, 148.1],
      [-35.8, 144.9],
      [-34.2, 142.1],
      [-34.1, 139.8],
      [-35.5, 138.9]
    ],
    translations: {
      en: {
        name: 'Murray River',
        clues: [
          'Australia’s longest river, rising in the Snowy Mountains.',
          'Forms most of the border between New South Wales and Victoria.',
          'Meets the Darling River before emptying into the Southern Ocean in South Australia.'
        ]
      },
      es: {
        name: 'Río Murray',
        clues: [
          'El río más largo de Australia, nacido en las Montañas Nevadas.',
          'Forma gran parte de la frontera entre Nueva Gales del Sur y Victoria.',
          'Recibe al río Darling y desemboca en Australia Meridional.'
        ]
      },
      fr: {
        name: 'Fleuve Murray',
        clues: [
          'Le plus long fleuve d’Australie, né dans les Snowy Mountains.',
          'Forme une grande part de la frontière entre Nouvelle-Galles du Sud et Victoria.',
          'Rejoint la rivière Darling avant l’océan Austral.'
        ]
      },
      de: {
        name: 'Murray River',
        clues: [
          'Australiens längster Fluss, der in den Snowy Mountains entspringt.',
          'Bildet größtenteils die Grenze zwischen New South Wales und Victoria.',
          'Nimmt den Darling River auf und mündet in South Australia.'
        ]
      },
      pt: {
        name: 'Rio Murray',
        clues: [
          'O maior rio da Austrália, nascendo nas Snowy Mountains.',
          'Forma grande parte da divisa entre Nova Gales do Sul e Vitória.',
          'Encontra o rio Darling antes de desaguar na Austrália Meridional.'
        ]
      },
      ar: {
        name: 'نهر موراي',
        clues: [
          'أطول أنهار أستراليا وينبع من جبال سنوي.',
          'يشكل معظم الحدود بين نيو ساوث ويلز وفيكتوريا.',
          'يلتقي بنهر دارلينغ قبل أن يصب في جنوب أستراليا.'
        ]
      },
      hi: {
        name: 'मरे नदी',
        clues: [
          'स्नोई पर्वतों से निकलने वाली ऑस्ट्रेलिया की सबसे लंबी नदी।',
          'न्यू साउथ वेल्स और विक्टोरिया के बीच अधिकांश सीमा बनाती है।',
          'डार्लिंग नदी से मिलकर दक्षिण ऑस्ट्रेलिया में समुद्र में गिरती है।'
        ]
      },
      ru: {
        name: 'Река Муррей',
        clues: [
          'Самая длинная река Австралии, берущая начало в Снежных горах.',
          'Служит границей между Новым Южным Уэльсом и Викторией.',
          'Сливается с рекой Дарлинг и впадает в океан в Южной Австралии.'
        ]
      },
      zh: {
        name: '墨累河',
        clues: [
          '澳大利亚最长的河流，发源于雪山山脉。',
          '构成了新南威尔士州与维多利亚州之间的大部分边界。',
          '汇合达令河后在南澳大利亚州注入海洋。'
        ]
      },
      ja: {
        name: 'マレー川',
        clues: [
          'スノーウィー山脈に源を発するオーストラリア最長の川です。',
          'ニューサウスウェールズ州とビクトリア州の州境の大部分を成します。',
          'ダーリング川と合流し、南オーストラリア州で海に注ぎます。'
        ]
      }
    }
  }
];
