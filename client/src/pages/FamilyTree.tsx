import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

// ─── Portrait CDN URLs ───────────────────────────────────────────────────────
const CDN: Record<string, string> = {
  james: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/WfCYWCiyrWpYITmT.jpg",
  martha: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/diGMSPRZKLlhrUqS.jpg",
  alexander: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/EwDEUFtQKzxZmOSc.png",
  janet: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/lVaWoLeoaxmdMiJm.jpg",
  silas: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/TrzgzgjirnnRenyM.jpg",
  isabella: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/zmcOqESmOkWpEIaY.jpg",
  charles: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/IUoKhswtpjzMUspy.jpg",
  rebecca: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/pJbOJpMuUkxEPlsT.jpg",
  julia: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/bpOHZKItewFPJomC.jpg",
  susan: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/mCIaNOBovwoMGXio.jpg",
  martha_flandrau: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/SEMUIkdNLYjFUYJm.jpg",
  tilden: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/iQyKkOmpzwwNvTuu.jpg",
  sarah: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/ZNOcOzovpxxQQDWh.jpg",
  frank: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/kJwnELPQvRzBYxiu.jpg",
  isabellaSelmes: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/CsGmHFmjXEkvYpLs.png",
  robertFerguson: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/RZwmTcGQHqQjTtXc.jpg",
  johnGreenway: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/PxxUcENepbSAssdL.jpg",
  harryKing: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/qTrYqlsufYVfdcrQ.jpg",
  marthaFerguson: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/YlUnDdjSfIzcOMPU.jpg",
  bobFerguson: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/iwlQITyKSkxystZB.jpg",
  jackGreenway: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/PinPyWpfRwAcNGIv.jpg",
};

// ─── Member Data ─────────────────────────────────────────────────────────────
interface Member {
  id: string;
  name: string;
  dates: string;
  overview: string;
  fullBio: string;
  img?: string;
  role?: string;
  bioUrl: string;
}

const MEMBERS: Record<string, Member> = {
  johnJr: {
    id: "johnJr",
    name: "John Dinsmore, Jr.",
    dates: "1766 – 1814",
    role: "James's Father",
    bioUrl: "https://www.dinsmorefarm.org/the-family/john-dinsmore-jr/",
    overview: "Born in Londonderry, New Hampshire in 1766. A well-to-do farmer and innkeeper who served as Justice of the Peace. Father of James Dinsmore. In 1807, he changed the family name spelling from 'Dinsmoor' to 'Dinsmore.' Died of tuberculosis in 1814.",
    fullBio: `John Dinsmoor was born in Londonderry, New Hampshire in 1766. Little is known of his life, but it is believed that he did not attend Dartmouth like his younger brother, Silas. He married Susannah Bell, the sister of two later governors of New Hampshire. In his community, he was considered a well-to-do farmer and innkeeper and served his neighbors as Justice of the Peace. The couple had three sons and five daughters, of which James was the second child and eldest son.

In 1807, John altered the spelling of his last name to the more American 'Dinsmore'. Several of his siblings did the same, but his brother, Silas, refused to change. The same year he changed the spelling of his last name, Susannah died. John remarried to Mary Rogers and they had two more children. Three Dinsmore children died in 1812. While there was mention of a spotted fever outbreak that year, family lore suggests that they (as well as Susannah Bell in 1807) died of tuberculosis. John Dinsmore also ended up dying of tuberculosis in 1814, leaving each of his children a nice legacy.`,
  },
  susannah: {
    id: "susannah",
    name: "Susannah Dinsmore",
    dates: "1761 – 1807",
    role: "James's Mother",
    bioUrl: "https://www.dinsmorefarm.org/the-family/susannah-dinsmoor-(bell)/",
    overview: "Born in Derry, New Hampshire. Her brothers John and Samuel Bell became governors of New Hampshire. Married John Dinsmore and had three sons and five daughters. Died of consumption (tuberculosis) in 1807.",
    fullBio: `Susannah Bell was born in Derry, New Hampshire, to John and Mary Ann Bell. Although she was one of twelve children, only four of the Bells lived to produce offspring. Her brothers, John and Samuel, became involved in state politics and served as governors of New Hampshire. Samuel also went on to serve in the U.S. Senate as an Anti-Jackson Whig. His son, Dr. John Bell was one of James Dinsmore's closest friends until he died in Louisiana in 1830.

Susannah married John Dinsmore and moved to Windham. She gave birth to three sons and five daughters. While all of the sons survived to adulthood, one of her daughters died in infancy and two others died the same day in 1812, perhaps of spotted fever. Susannah died in 1807 from consumption (now known as tuberculosis). The same disease killed her son, Silas, Jr., her brother, Samuel, and her nephew, Dr. John Bell. The Bell family believed they were peculiarly susceptible to consumption.`,
  },
  alexander: {
    id: "alexander",
    name: "Alexander Macomb, Sr.",
    dates: "1748 – 1831",
    role: "Martha's Father",
    img: CDN.alexander,
    bioUrl: "https://www.dinsmorefarm.org/the-family/alexander-macomb/",
    overview: "Born in Ireland, Alexander Macomb came to America and became a merchant and fur trader. He was one of the wealthiest men in New York before financial reversals. Father of Martha Macomb Dinsmore.",
    fullBio: `Alexander Macomb was born in 1748 in Ireland. He came to America as a young man and became involved in the fur trade and land speculation, amassing considerable wealth. At one point he was considered one of the richest men in New York. He purchased nearly four million acres of land in northern New York State, but financial difficulties led to his imprisonment for debt.

After his release, he rebuilt his fortune through various business ventures. He married Janet Marshall Rucker and had several children, including Martha, who would marry James Dinsmore. Alexander died in 1831 in Georgetown, D.C., where he had moved to be near his son, Major General Alexander Macomb, who served as Commanding General of the United States Army.`,
  },
  janet: {
    id: "janet",
    name: "Janet Macomb",
    dates: "1761 – 1849",
    role: "Martha's Mother",
    img: CDN.janet,
    bioUrl: "https://www.dinsmorefarm.org/the-family/jane-macomb-(marshall)/",
    overview: "Born Janet Marshall in New Providence, Bahamas in 1761. First married John Rucker, then Alexander Macomb in 1791. Mother of Martha Macomb Dinsmore and seven other children.",
    fullBio: `Janet Marshall, later called 'Jane', was born to Charles and Elizabeth Cox Marshall in August 1761 in New Providence, Bahamas. She was quite young when her father died. Her mother moved the family to New York City where she was remarried to John Ramsay, a merchant of the city. She and her older sister, Margaret, were soon joined by six more Ramsay siblings. When young, Jane split her time between Manhattan, Philadelphia, and Elizabeth Town, New Jersey.

In the 1780s, she was married to John Rucker, a German immigrant and wealthy merchant of the firm Constable & Rucker Company. She had only one son, John, before her husband died. In 1791 she married again, this time to Alexander Macomb, another merchant and also a sometime business partner of Constable. She had seven more children. After her husband gave up or lost his business concerns in New York City, the couple moved to Georgetown, D.C. where they could be near Alexander's son and namesake.`,
  },
  silas: {
    id: "silas",
    name: "Silas Dinsmoor",
    dates: "1766 – 1847",
    role: "James's Uncle",
    img: CDN.silas,
    bioUrl: "http://www.dinsmorefarm.org/the-family/silas-dinsmore/",
    overview: "One of the more colorful Dinsmore clan members, Silas kept the original spelling of the family name. Born September 26, 1766 in Windham, New Hampshire. He wrote James about the beautiful land in Boone County that would become the Homestead.",
    fullBio: `Silas Dinsmoor was one of the more colorful members of the Dinsmore clan. Unlike some of his brothers, Silas chose to keep the spelling of his last name in line with his ancestors. In the postscript to a letter to his brother in 1807, he wrote, "I am not ashamed that I am my father's son, and I will wear the name he gave me in honour of his memory."

Silas was born in Windham, New Hampshire on September 26, 1766, the son of John and Martha McKeen Dinsmoor. He attended Dartmouth College and went on to serve as a U.S. Indian Agent to the Cherokee and Choctaw nations. He was instrumental in encouraging his nephew James to settle in Boone County, Kentucky, writing to him about the beautiful tract of land that would become the Dinsmore Homestead. Silas died in 1847.`,
  },
  james: {
    id: "james",
    name: "James Dinsmore",
    dates: "1790 – 1872",
    role: "Patriarch",
    img: CDN.james,
    bioUrl: "https://www.dinsmorefarm.org/the-family/james-dinsmore/",
    overview: "Born in Windham, New Hampshire. Graduated from Dartmouth College in 1813, studied law in Natchez, Mississippi. Married Martha Macomb in 1829 and settled the family on an 800-acre farm in Boone County, Kentucky — the Dinsmore Homestead. Died December 21, 1872.",
    fullBio: `James Dinsmore was born in 1790 in Windham, New Hampshire, the son of John Dinsmore, Jr. and Susannah Bell. He graduated from Dartmouth College in 1813 and studied law in Natchez, Mississippi. In May 1829 he married Martha Macomb.

After spending time in Louisiana, James was encouraged by his uncle Silas Dinsmoor to look at land in Boone County, Kentucky. By 1842, James' house in Boone County was completed and the family moved. Corn, oats, hay, beans, and potatoes were the main crops raised on what was an 800-acre farm in 1848. James sold grape cuttings from his vineyard and in 1860 he produced 300 gallons of wine; he also had 140 sheep and goats roaming the hills that gave James over 100 pounds of wool.

Before the Civil War, James sold off some of his land to a neighbor, leaving himself with 400 acres. This is about the amount inherited by his daughter, Julia Dinsmore. He died on December 21st, 1872 in the dining room of the home he designed and is buried up the hill in the Dinsmore family graveyard.`,
  },
  martha: {
    id: "martha",
    name: "Martha Macomb",
    dates: "1797 – 1859",
    role: "Matriarch",
    img: CDN.martha,
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-macomb-dinsmore/",
    overview: "Born in 1797 in New Jersey. Married James Dinsmore in May 1829. Together they had three daughters: Isabella (1830), Julia (1833), and Susan (1835). Died in 1859 at the Homestead.",
    fullBio: `Martha Macomb was born in 1797 in Burlington, New Jersey, the daughter of Alexander Macomb, Sr. and Janet Marshall Rucker. She married James Dinsmore in May 1829. The couple initially lived in Louisiana before moving to Boone County, Kentucky, where James built the Dinsmore Homestead.

Martha and James had three daughters: Isabella (1830), Julia (1833), and Susan (1835). Martha was known for her strong will and her devotion to her family. She managed the household while James oversaw the farm operations. Martha died in 1859 at the Homestead, leaving James to raise their daughters with the help of extended family.`,
  },
  isabella: {
    id: "isabella",
    name: "Isabella Dinsmore",
    dates: "1830 – 1867",
    role: "Eldest Daughter",
    img: CDN.isabella,
    bioUrl: "https://www.dinsmorefarm.org/the-family/isabella-dinsmore-flandrau/",
    overview: "Born at the Homestead in 1830. Married Charles Flandrau in 1859. She was the mother of Martha 'Patty' and Sarah 'Sally' Flandrau. Died in 1867, leaving Charles a widower who later married Rebecca Blair.",
    fullBio: `Isabella Dinsmore was born in 1830, the eldest daughter of James and Martha Dinsmore. She grew up at the Dinsmore Homestead in Boone County, Kentucky. In 1859, she married Charles Eugene Flandrau, a lawyer and judge from Minnesota.

The couple had two daughters: Martha "Patty" (1861) and Sarah "Sally" (1867). Tragically, Isabella died in 1867, shortly after Sally's birth. Her death left Charles a widower with two young daughters. Charles would later marry Rebecca Blair Riddle in 1870. Isabella is buried in the Dinsmore family graveyard.`,
  },
  charles: {
    id: "charles",
    name: "Charles Flandrau",
    dates: "1828 – 1903",
    role: "Isabella's & Rebecca's Husband",
    img: CDN.charles,
    bioUrl: "http://www.dinsmorefarm.org/the-family/charles-eugene-flandrau/",
    overview: "Born in New York City in 1828. A lawyer, judge, and Indian agent in Minnesota. First married Isabella Dinsmore in 1859; after her death in 1867, married Rebecca Blair Riddle in 1870. Father of Martha 'Patty' and Sarah 'Sally' Flandrau.",
    fullBio: `Charles Eugene Flandrau was born on July 15, 1828 in New York City. He studied law and moved to Minnesota where he served as an Indian Agent and later as an Associate Justice of the Minnesota Supreme Court. He gained fame for his defense of New Ulm during the U.S.-Dakota War of 1862.

Charles married Isabella Dinsmore in 1859 and they had two daughters: Martha "Patty" (1861) and Sarah "Sally" (1867). After Isabella's death in 1867, Charles married Rebecca Blair Riddle in 1870. He continued his law practice in St. Paul, Minnesota, and remained close to the Dinsmore family throughout his life. He died in 1903 and is buried in the Dinsmore family graveyard.`,
  },
  rebecca: {
    id: "rebecca",
    name: "Rebecca Blair",
    dates: "1839 – 1911",
    role: "Charles's 2nd Wife",
    img: CDN.rebecca,
    bioUrl: "https://www.dinsmorefarm.org/the-family/rebecca-blair-riddle/",
    overview: "Born Rebecca Blair Riddle near Pittsburgh in 1839. Married Charles Flandrau in 1870, three years after Isabella's death. Stepmother to Patty and Sally Flandrau. Died in 1911.",
    fullBio: `Rebecca Blair Riddle was born in 1839 near Pittsburgh, Pennsylvania. She married Charles Eugene Flandrau in 1870, three years after the death of his first wife, Isabella Dinsmore. Rebecca became stepmother to Charles's two daughters, Martha "Patty" and Sarah "Sally" Flandrau.

Rebecca was known for her warmth and her ability to integrate into the close-knit Dinsmore family. She and Charles lived primarily in St. Paul, Minnesota, where Charles practiced law. Rebecca maintained close ties with the Dinsmore Homestead throughout her life. She died in 1911 and is buried alongside Charles in the Dinsmore family graveyard.`,
  },
  julia: {
    id: "julia",
    name: "Julia Dinsmore",
    dates: "1833 – 1926",
    role: "Middle Daughter",
    img: CDN.julia,
    bioUrl: "https://www.dinsmorefarm.org/the-family/julia-stockton-dinsmore",
    overview: "Born in 1833, Julia never married and devoted her life to preserving the Dinsmore Homestead. She inherited the farm after her father's death and maintained it until her own death in 1926 at age 93.",
    fullBio: `Julia Stockton Dinsmore was born in 1833, the middle daughter of James and Martha Dinsmore. She never married and instead devoted her entire life to the Dinsmore Homestead. After her father's death in 1872, Julia inherited the farm and maintained it with remarkable dedication.

Julia was known for her sharp intellect, her love of literature, and her meticulous record-keeping. She preserved the family's letters, journals, and personal effects, creating an invaluable archive of 19th-century American life. Julia lived at the Homestead until her death in 1926 at the age of 93. Her preservation efforts ensured that the Dinsmore Homestead would survive as a historic site for future generations.`,
  },
  susan: {
    id: "susan",
    name: "Susan Dinsmore",
    dates: "1835 – 1851",
    role: "Youngest Daughter",
    img: CDN.susan,
    bioUrl: "https://www.dinsmorefarm.org/the-family/susan-bell-dinsmore/",
    overview: "Born in 1835, the youngest daughter of James and Martha Dinsmore. Died tragically young in 1851 at just 16 years of age.",
    fullBio: `Susan Bell Dinsmore was born in 1835, the youngest daughter of James and Martha Dinsmore. Named after her grandmother, Susannah Bell, Susan was known for her gentle nature and her love of the outdoors.

Tragically, Susan died in 1851 at just 16 years of age. Her early death was a devastating blow to the Dinsmore family. She is buried in the Dinsmore family graveyard alongside other family members.`,
  },
  martha_flandrau: {
    id: "martha_flandrau",
    name: "Martha 'Patty' Flandrau",
    dates: "1861 – 1923",
    role: "Isabella & Charles's Daughter",
    img: CDN.martha_flandrau,
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-patty-flandrau-selmes/",
    overview: "Born in 1861 to Isabella Dinsmore and Charles Flandrau. Married Tilden Russell Selmes in 1883. Mother of Isabella Selmes, who would become one of the most remarkable women of her generation.",
    fullBio: `Martha "Patty" Flandrau was born in 1861, the elder daughter of Isabella Dinsmore and Charles Eugene Flandrau. After her mother's death in 1867, Patty was raised by her father and stepmother, Rebecca Blair.

In 1883, Patty married Tilden Russell Selmes, a young lawyer from a prominent family. The couple had one daughter, Isabella, born in 1886. Tragically, Tilden died of tuberculosis in 1895, leaving Patty a widow at 34. She devoted herself to raising Isabella, eventually moving to New York City at the invitation of her uncle, Frank Cutcheon. Patty died in 1923.`,
  },
  tilden: {
    id: "tilden",
    name: "Tilden Selmes",
    dates: "1853 – 1895",
    role: "Patty's Husband",
    img: CDN.tilden,
    bioUrl: "https://www.dinsmorefarm.org/the-family/tilden-russell-selmes-jr/",
    overview: "Born in 1853. Married Martha 'Patty' Flandrau in 1883. Father of Isabella Selmes. Died of tuberculosis in 1895 at age 42.",
    fullBio: `Tilden Russell Selmes, Jr. was born in 1853 into a prominent family. He studied law and established a practice in St. Paul, Minnesota, where he met and courted Martha "Patty" Flandrau. The couple married in 1883.

Tilden and Patty had one daughter, Isabella, born in 1886. Tilden was known for his intelligence and charm, but his life was cut short by tuberculosis. He died in 1895 at the age of 42, leaving Patty to raise their young daughter alone.`,
  },
  sarah: {
    id: "sarah",
    name: "Sarah 'Sally' Flandrau",
    dates: "1867 – 1947",
    role: "Isabella & Charles's Daughter",
    img: CDN.sarah,
    bioUrl: "https://www.dinsmorefarm.org/the-family/sarah-sally-flandrau-cutcheon/",
    overview: "Born in 1867, the younger daughter of Isabella Dinsmore and Charles Flandrau. Married Frank Cutcheon in 1891. Sally was born shortly before her mother Isabella's death.",
    fullBio: `Sarah "Sally" Flandrau was born in 1867, the younger daughter of Isabella Dinsmore and Charles Eugene Flandrau. Her mother died shortly after her birth, and Sally was raised by her father and stepmother, Rebecca Blair.

In 1891, Sally married Franklin Warner M. Cutcheon, who had been a junior partner in her father's law firm. The couple moved to New York City in 1895. Sally maintained close ties with her aunt Julia at the Dinsmore Homestead and with her sister Patty. She died in 1947.`,
  },
  frank: {
    id: "frank",
    name: "Frank Cutcheon",
    dates: "1864 – 1936",
    role: "Sally's Husband",
    img: CDN.frank,
    bioUrl: "https://www.dinsmorefarm.org/the-family/franklin-warner-m-cutcheon/",
    overview: "Born in Dexter, Michigan in 1864. Graduated from the University of Michigan. Married Sally Flandrau in 1891. Served as General Secretary of the Red Cross during WWI and as legal adviser to General Pershing.",
    fullBio: `Frank Cutcheon was raised in Dexter, Michigan. After graduating from the University of Michigan, he moved to St. Paul, Minnesota where he became a junior partner in a small law firm that included Charles Flandrau. He courted Flandrau's daughter, Sally, for several years, before she consented to marry him, but all evidence points to a happy marriage.

However, Frank did not always get along with Sally's family. In 1895 he broke up the law firm and took Sally to New York City to live, alienating her from all but Julia and Patty. Because of the interest he took in his niece, Isabella, he invited her and her mother, Patty, to live with him in New York and he continued to act as Isabella's financial and personal advisor for the remainder of his life.

During World War One, Frank's connections led him to take an appointment as General Secretary of the Red Cross and he served as legal adviser to General Pershing. After the war, he served on the post-war Reparations Commission, whose mission was to implement the Dawes Plan and he worked with the Young commission. He is buried in the Dinsmore Graveyard.`,
  },
  isabellaSelmes: {
    id: "isabellaSelmes",
    name: "Isabella Selmes",
    dates: "1886 – 1953",
    role: "Patty & Tilden's Daughter",
    img: CDN.isabellaSelmes,
    bioUrl: "https://www.dinsmorefarm.org/the-family/isabella-selmes-ferguson-greenway-king/",
    overview: "Born in 1886 to Patty Flandrau and Tilden Selmes. Married three times: Robert Ferguson (1905), John Greenway (1923), and Harry King (1939). First woman to represent Arizona in the U.S. Congress.",
    fullBio: `Isabella Selmes was born in 1886, the only child of Martha "Patty" Flandrau Selmes and Tilden Russell Selmes, Jr. After her father's death from tuberculosis in 1895, Isabella was raised by her mother with the support of her uncle, Frank Cutcheon, in New York City.

In 1905, Isabella married Robert Harry Munro Ferguson, a friend of Theodore Roosevelt. The couple had two children: Martha (1906) and Robert "Bob" (1908). Robert Ferguson suffered from tuberculosis and the family moved to the Southwest for his health. He died in 1922.

In 1923, Isabella married John Campbell Greenway, a mining engineer and war hero who had been a friend of her first husband. They had a son, John Selmes "Jack" Greenway (1924), but John died in 1926 from complications following surgery.

In 1933, Isabella was elected to the U.S. Congress, becoming the first woman to represent Arizona. She served until 1937. In 1939, she married Harry Orland King, a businessman. Isabella died in 1953 and is remembered as one of the most remarkable women of her generation.`,
  },
  robertFerguson: {
    id: "robertFerguson",
    name: "Robert Ferguson",
    dates: "1867 – 1922",
    role: "Isabella's 1st Husband",
    img: CDN.robertFerguson,
    bioUrl: "https://www.dinsmorefarm.org/the-family/robert-harry-munro-ferguson/",
    overview: "Born in Scotland in 1867. A friend of Theodore Roosevelt and fellow Rough Rider. Married Isabella Selmes in 1905. Father of Martha and Robert 'Bob' Ferguson. Died of tuberculosis in 1922.",
    fullBio: `Robert Harry Munro Ferguson was born in 1867 in Scotland. He came to America as a young man and became a close friend of Theodore Roosevelt. He served with Roosevelt's Rough Riders during the Spanish-American War.

In 1905, Robert married Isabella Selmes. The couple had two children: Martha (1906) and Robert "Bob" (1908). Robert suffered from tuberculosis for much of his adult life, and the family moved to New Mexico and Arizona seeking a healthier climate. Despite his illness, Robert was known for his gentle nature and his devotion to his family. He died in 1922, and Isabella later married his friend, John Campbell Greenway.`,
  },
  johnGreenway: {
    id: "johnGreenway",
    name: "John Greenway",
    dates: "1872 – 1926",
    role: "Isabella's 2nd Husband",
    img: CDN.johnGreenway,
    bioUrl: "https://www.dinsmorefarm.org/the-family/john-campbell-greenway/",
    overview: "Born in Alabama in 1872. Yale graduate, mining engineer, and war hero. Served with Roosevelt's Rough Riders. Married Isabella Selmes in 1923. Father of Jack Greenway. Died in 1926.",
    fullBio: `John Campbell Greenway was born in Alabama in 1872 and grew up in Arkansas and Virginia before graduating from Yale University with an engineering degree. He began his career with Carnegie's U.S. Steel but left after a short time to see some action in the Spanish American War (1898-1901) with Roosevelt's Rough Riders. In the conflict he forged a close relationship with Theodore Roosevelt and Robert Ferguson. He fought with distinction earning himself a Silver Star after reaching the top of San Juan Hill before any other commissioned officer.

Teddy Roosevelt was quoted as saying, "A strapping fellow, entirely fearless, modest and quiet, with the ability to take care of men under him so as to bring them to the highest point of solderly perfection, to be counted upon with absolute certainty in every emergency."

On his return from the war, he worked his way up to General Superintendent of the Mesabi range in Minnesota before moving on to Arizona and copper mining. It was during this time in Arizona that Greenway renewed his friendship with Robert Ferguson and was captivated by Ferguson's wife. The entrance of the United States into World War I in 1917 prompted the 45-year-old Greenway to offer his services. He went on to earn several commendations and returned home as a brevetted Brigadier General.

In 1923, one year after the death of Robert Ferguson, Greenway married the widow, Isabella. The couple had a son, John Selmes Greenway ("Jack"), but their happiness was short-lived as Greenway died from complications following a gall-bladder surgery only three years after their wedding. John was originally buried in Ajo, Arizona but later moved to the Dinsmore family graveyard.`,
  },
  harryKing: {
    id: "harryKing",
    name: "Harry King",
    dates: "1890 – 1976",
    role: "Isabella's 3rd Husband",
    img: CDN.harryKing,
    bioUrl: "https://www.dinsmorefarm.org/the-family/harry-orland-king/",
    overview: "Born in 1890. Married Isabella Selmes in 1939, her third marriage. A businessman who supported Isabella's political and philanthropic endeavors. Died in 1976.",
    fullBio: `Harry Orland King was born in 1890. He married Isabella Selmes Ferguson Greenway in 1939, becoming her third husband. Harry was a successful businessman who supported Isabella's various political and philanthropic endeavors.

The couple lived in Arizona where Isabella had established deep roots through her previous marriages and her congressional service. Harry was known for his quiet strength and his devotion to Isabella. He survived her by over two decades, dying in 1976.`,
  },
  marthaFerguson: {
    id: "marthaFerguson",
    name: "Martha Ferguson",
    dates: "1906 – 1994",
    role: "Isabella & Robert's Daughter",
    img: CDN.marthaFerguson,
    bioUrl: "https://www.dinsmorefarm.org/the-family/robert-munro-ferguson/",
    overview: "Born in 1906, the eldest child of Isabella Selmes and Robert Ferguson. Named after her grandmother, Martha 'Patty' Flandrau.",
    fullBio: `Martha Ferguson was born in 1906, the eldest child of Isabella Selmes and Robert Harry Munro Ferguson. She was named after her grandmother, Martha "Patty" Flandrau Selmes. Martha grew up in the Southwest, where her family had moved for her father's health.

Martha witnessed her mother's remarkable life firsthand — from the loss of two husbands to her election to Congress. She carried on the family's tradition of public service and community involvement. Martha died in 1994.`,
  },
  bobFerguson: {
    id: "bobFerguson",
    name: "Robert 'Bob' Ferguson",
    dates: "1908 – 1984",
    role: "Isabella & Robert's Son",
    img: CDN.bobFerguson,
    bioUrl: "https://www.dinsmorefarm.org/the-family/robert-munro-ferguson/",
    overview: "Born in 1908, the son of Isabella Selmes and Robert Ferguson. Named after his father.",
    fullBio: `Robert "Bob" Munro Ferguson was born in 1908, the son of Isabella Selmes and Robert Harry Munro Ferguson. Named after his father, Bob grew up in the American Southwest where his family had settled.

Bob carried on the family's legacy of service and connection to the land. He maintained ties to the Dinsmore Homestead throughout his life. Bob died in 1984.`,
  },
  jackGreenway: {
    id: "jackGreenway",
    name: "Jack S. Greenway",
    dates: "1924 – 1995",
    role: "Isabella & John's Son",
    img: CDN.jackGreenway,
    bioUrl: "https://www.dinsmorefarm.org/the-family/john-selmes-jack-greenway/",
    overview: "Born in 1924, the son of Isabella Selmes and John Campbell Greenway. His father died when Jack was only two years old.",
    fullBio: `John Selmes "Jack" Greenway was born in 1924, the son of Isabella Selmes and John Campbell Greenway. His father died from complications following surgery when Jack was only two years old.

Jack was raised by his mother, who went on to serve in the U.S. Congress and later married Harry King. Jack grew up in Arizona and maintained the family's connection to both the Southwest and the Dinsmore Homestead in Kentucky. He died in 1995.`,
  },
};

// ─── Generation Layout ───────────────────────────────────────────────────────
// Each generation is a row of "groups" — couples, singles, or multi-marriage clusters
interface TreeGroup {
  members: string[]; // member IDs in display order
  marriages?: { between: [number, number]; label: string; note?: string }[]; // index pairs within members[]
}

interface TreeGeneration {
  label: string;
  groups: TreeGroup[];
}

const GENERATIONS: TreeGeneration[] = [
  {
    label: "Generation I — Parents",
    groups: [
      { members: ["johnJr", "susannah"] },
      { members: ["alexander", "janet"] },
    ],
  },
  {
    label: "Generation II — Patriarch & Matriarch",
    groups: [
      { members: ["silas"] },
      {
        members: ["james", "martha"],
        marriages: [{ between: [0, 1], label: "m. 1829" }],
      },
    ],
  },
  {
    label: "Generation III — Children",
    groups: [
      {
        members: ["isabella", "charles", "rebecca"],
        marriages: [
          { between: [0, 1], label: "m. 1859" },
          { between: [1, 2], label: "m. 1870", note: "2nd wife" },
        ],
      },
      { members: ["julia"] },
      { members: ["susan"] },
    ],
  },
  {
    label: "Generation IV — Grandchildren",
    groups: [
      {
        members: ["martha_flandrau", "tilden"],
        marriages: [{ between: [0, 1], label: "m. 1883" }],
      },
      {
        members: ["sarah", "frank"],
        marriages: [{ between: [0, 1], label: "m. 1891" }],
      },
    ],
  },
  {
    label: "Generation V — Great-Grandchildren",
    groups: [
      {
        members: ["isabellaSelmes", "robertFerguson"],
        marriages: [{ between: [0, 1], label: "m. 1905", note: "#1" }],
      },
      {
        members: ["isabellaSelmes", "johnGreenway"],
        marriages: [{ between: [0, 1], label: "m. 1923", note: "#2" }],
      },
      {
        members: ["isabellaSelmes", "harryKing"],
        marriages: [{ between: [0, 1], label: "m. 1939", note: "#3" }],
      },
    ],
  },
  {
    label: "Generation VI — Great-Great-Grandchildren",
    groups: [
      { members: ["marthaFerguson"] },
      { members: ["bobFerguson"] },
      { members: ["jackGreenway"] },
    ],
  },
];

// ─── Portrait Component ───────────────────────────────────────────────────────
function Portrait({
  member,
  onClick,
}: {
  member: Member;
  onClick: (m: Member) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      onClick={() => onClick(member)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative">
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-1.5 rounded-full"
          animate={{
            boxShadow: hovered
              ? "0 0 0 3px #c9a84c, 0 0 30px rgba(201,168,76,0.6)"
              : "0 0 0 2px rgba(201,168,76,0.25)",
          }}
          transition={{ duration: 0.25 }}
          style={{ borderRadius: "50%" }}
        />
        {/* Portrait circle — responsive sizes */}
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 rounded-full overflow-hidden border-2 relative"
          style={{
            borderColor: hovered ? "#c9a84c" : "rgba(201,168,76,0.35)",
            background: "linear-gradient(135deg, #2d1f0e 0%, #4a3728 100%)",
            transition: "border-color 0.25s",
          }}
        >
          {member.img ? (
            <img
              src={member.img}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              style={{
                filter: hovered ? "brightness(1.15) contrast(1.05)" : "brightness(0.9) sepia(0.1)",
                transition: "filter 0.25s",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-30">
                <circle cx="50" cy="35" r="18" fill="#c9a84c" />
                <ellipse cx="50" cy="82" rx="28" ry="20" fill="#c9a84c" />
              </svg>
            </div>
          )}
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }}
          />
        </div>
      </div>
      {/* Name & dates — responsive text */}
      <div className="mt-2 lg:mt-3 text-center max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[160px] xl:max-w-[180px]">
        <p
          className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[#1a2f4e] leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {member.name}
        </p>
        {member.dates && (
          <p className="text-[10px] sm:text-xs md:text-sm text-[#6b5744] mt-0.5" style={{ fontFamily: "'EB Garamond', serif" }}>
            {member.dates}
          </p>
        )}
        {member.role && (
          <p className="text-[9px] sm:text-[10px] md:text-xs text-[#c9a84c] uppercase tracking-wide mt-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
            {member.role}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Marriage Connector ───────────────────────────────────────────────────────
function MarriageConnector({ label, note }: { label: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center self-start mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 px-1 sm:px-2 md:px-3">
      <div className="flex items-center gap-1">
        <div className="h-[2px] w-4 sm:w-6 md:w-8 lg:w-10 bg-[#c9a84c]/70" />
        <span className="text-[10px] sm:text-xs md:text-sm text-[#c9a84c] italic whitespace-nowrap font-medium" style={{ fontFamily: "'EB Garamond', serif" }}>
          {label}
        </span>
        <div className="h-[2px] w-4 sm:w-6 md:w-8 lg:w-10 bg-[#c9a84c]/70" />
      </div>
      {note && (
        <span className="text-[8px] sm:text-[10px] md:text-xs text-[#6b5744] mt-0.5 font-medium" style={{ fontFamily: "'EB Garamond', serif" }}>
          ({note})
        </span>
      )}
    </div>
  );
}

// ─── Bio Modal (Overview) ─────────────────────────────────────────────────────
function BioModal({ member, onClose, onReadMore }: { member: Member; onClose: () => void; onReadMore: (m: Member) => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 bg-[#fdf6e3] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ border: "1px solid rgba(201,168,76,0.4)", boxShadow: "0 25px 60px rgba(26,47,78,0.3)" }}
      >
        <div className="relative p-6 pb-4" style={{ background: "linear-gradient(135deg, #1a2f4e 0%, #2d4a1e 100%)" }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c9a84c]/60 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2d1f0e 0%, #4a3728 100%)" }}>
              {member.img ? (
                <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-30">
                    <circle cx="50" cy="35" r="18" fill="#c9a84c" />
                    <ellipse cx="50" cy="82" rx="28" ry="20" fill="#c9a84c" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                {member.role || "Family Member"}
              </p>
              <h2 className="text-white text-xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {member.name}
              </h2>
              {member.dates && (
                <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "'EB Garamond', serif" }}>{member.dates}</p>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-[#4a3728] leading-relaxed" style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}>
            {member.overview}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => onReadMore(member)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1a2f4e] hover:text-[#c9a84c] transition-colors"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.05em" }}
            >
              Read Full Biography Below ↓
            </button>
            <a
              href={member.bioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6b5744] hover:text-[#c9a84c] transition-colors"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.05em" }}
            >
              View on Dinsmorefarm.org →
            </a>
          </div>
        </div>
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #c9a84c, #e8d5a3, #c9a84c)" }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Full Bio Section ─────────────────────────────────────────────────────────
function FullBioSection({ member }: { member: Member }) {
  return (
    <div id={`bio-${member.id}`} className="scroll-mt-24">
      <div
        className="rounded-2xl overflow-hidden border border-[#c9a84c]/20"
        style={{ background: "rgba(253,246,227,0.8)" }}
      >
        <div className="flex items-center gap-4 p-5 md:p-6" style={{ background: "linear-gradient(135deg, #1a2f4e 0%, #2d4a1e 100%)" }}>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#c9a84c]/60 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2d1f0e 0%, #4a3728 100%)" }}>
            {member.img ? (
              <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-30">
                  <circle cx="50" cy="35" r="18" fill="#c9a84c" />
                  <ellipse cx="50" cy="82" rx="28" ry="20" fill="#c9a84c" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className="text-[#c9a84c] text-[10px] uppercase tracking-widest mb-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
              {member.role}
            </p>
            <h3 className="text-white text-lg md:text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {member.name}
            </h3>
            {member.dates && (
              <p className="text-white/60 text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>{member.dates}</p>
            )}
          </div>
        </div>
        <div className="p-5 md:p-6">
          {member.fullBio.split("\n\n").map((para, i) => (
            <p key={i} className="text-[#4a3728] leading-relaxed mb-4 last:mb-0" style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}>
              {para}
            </p>
          ))}
          <a
            href={member.bioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[#1a2f4e] hover:text-[#c9a84c] transition-colors"
            style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.05em" }}
          >
            View on Dinsmorefarm.org →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Generation Row ───────────────────────────────────────────────────────────
function GenerationRow({
  gen,
  onSelect,
}: {
  gen: TreeGeneration;
  onSelect: (m: Member) => void;
}) {
  const shownIds = new Set<string>();

  return (
    <div className="mb-4">
      {/* Generation label with decorative lines */}
      <div className="flex items-center gap-3 mb-8 lg:mb-10">
        <div className="h-[2px] flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4))" }} />
        <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-[#c9a84c] whitespace-nowrap font-semibold"
          style={{ fontFamily: "'Cinzel', serif" }}>
          {gen.label}
        </span>
        <div className="h-[2px] flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.4))" }} />
      </div>

      {/* Groups row */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-14 xl:gap-16">
        {gen.groups.map((group, gi) => {
          const renderedMembers: JSX.Element[] = [];

          group.members.forEach((memberId, mi) => {
            const member = MEMBERS[memberId];
            if (!member) return;

            // Check if this member was already shown (e.g., Isabella Selmes appears 3 times)
            const alreadyShown = shownIds.has(memberId);
            shownIds.add(memberId);

            // Add marriage connector before this member if there's a marriage linking previous member to this one
            if (mi > 0 && group.marriages) {
              const marriage = group.marriages.find(m => m.between[1] === mi);
              if (marriage) {
                renderedMembers.push(
                  <MarriageConnector key={`m-${gi}-${mi}`} label={marriage.label} note={marriage.note} />
                );
              }
            }

            if (!alreadyShown) {
              renderedMembers.push(
                <Portrait key={`p-${gi}-${mi}`} member={member} onClick={onSelect} />
              );
            }
          });

          return (
            <div key={gi} className="flex items-start gap-1 sm:gap-2 md:gap-3">
              {renderedMembers}
            </div>
          );
        })}
      </div>

      {/* Vertical descent line to next generation */}
      <div className="flex justify-center mt-6 lg:mt-8">
        <div className="w-[2px] h-8 sm:h-10 md:h-12 lg:h-14" style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.5), rgba(201,168,76,0.15))" }} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FamilyTree() {
  const [selected, setSelected] = useState<Member | null>(null);
  const biosRef = useRef<HTMLDivElement>(null);

  const handleReadMore = (member: Member) => {
    setSelected(null);
    setTimeout(() => {
      const el = document.getElementById(`bio-${member.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const scrollToBios = () => {
    biosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const bioOrder = [
    "johnJr", "susannah", "alexander", "janet", "silas",
    "james", "martha",
    "isabella", "charles", "rebecca", "julia", "susan",
    "martha_flandrau", "tilden", "sarah", "frank",
    "isabellaSelmes", "robertFerguson", "johnGreenway", "harryKing",
    "marthaFerguson", "bobFerguson", "jackGreenway",
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(45,74,30,0.08) 0%, transparent 50%),
          linear-gradient(160deg, #fdf6e3 0%, #f5ead0 30%, #ede0c4 60%, #f0e8d0 100%)
        `,
      }}
    >
      {/* Parchment texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Hero Header */}
      <div className="relative py-16 md:py-20 lg:py-24 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2f4e 0%, #0f1e30 50%, #2d4a1e 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M0,150 Q300,50 600,150 Q900,250 1200,150" stroke="#c9a84c" strokeWidth="2" fill="none" />
            <path d="M0,100 Q300,200 600,100 Q900,0 1200,100" stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs md:text-sm uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            The Dinsmore Family
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Family Tree
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg lg:text-xl" style={{ fontFamily: "'EB Garamond', serif" }}>
            Explore the immediate Dinsmore family members — those who lived on or visited the farm,
            or who had close ties to those who lived there. Click on any portrait to learn more.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-white/40 text-sm md:text-base">
            <span>Est. 1842</span><span>·</span><span>Burlington, Kentucky</span><span>·</span><span>6 Generations</span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[#4a3728] text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'EB Garamond', serif" }}>
            The Dinsmore Homestead has been home to six generations of one remarkable family.
            Hover over any portrait to highlight a family member, then click to read their biography.
          </p>
        </div>

        {/* Generations — no center spine line */}
        <div className="space-y-4 md:space-y-6">
          {GENERATIONS.map((gen, gi) => (
            <GenerationRow key={gi} gen={gen} onSelect={setSelected} />
          ))}
        </div>

        {/* Scroll to bios CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <button
            onClick={scrollToBios}
            className="inline-flex flex-col items-center gap-2 text-[#1a2f4e] hover:text-[#c9a84c] transition-colors"
          >
            <span className="text-xs md:text-sm uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
              Read Full Biographies
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Full Biographies Section */}
      <div ref={biosRef} className="scroll-mt-8">
        <div className="py-16 md:py-20 lg:py-24" style={{ background: "rgba(26,47,78,0.03)" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-[#c9a84c] text-xs md:text-sm uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                Complete Biographies
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a2f4e] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                The Family Members
              </h2>
              <p className="text-[#4a3728] max-w-2xl mx-auto text-base md:text-lg" style={{ fontFamily: "'EB Garamond', serif" }}>
                Detailed biographies of each family member, drawn from the extensive archives of the Dinsmore Homestead.
              </p>
            </div>

            <div className="space-y-8">
              {bioOrder.map((id) => {
                const member = MEMBERS[id];
                if (!member) return null;
                return <FullBioSection key={id} member={member} />;
              })}
            </div>

            {/* Extended tree PDF link */}
            <div className="text-center mt-16">
              <a
                href="https://www.dinsmorefarm.org/the-family/the-tree/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#c9a84c]/40 text-[#1a2f4e] hover:bg-[#c9a84c]/10 transition-colors text-sm md:text-base"
                style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}
              >
                View Extended Family Tree on Dinsmorefarm.org →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Modal */}
      <AnimatePresence>
        {selected && (
          <BioModal member={selected} onClose={() => setSelected(null)} onReadMore={handleReadMore} />
        )}
      </AnimatePresence>
    </div>
  );
}
