import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

// ─── Portrait CDN URLs ───────────────────────────────────────────────────────
const CDN: Record<string, string> = {
  james: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/WfCYWCiyrWpYITmT.jpg",
  martha: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/diGMSPRZKLlhrUqS.jpg",
  alexander: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/EwDEUFtQKzxZmOSc.png",
  silas: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/TrzgzgjirnnRenyM.jpg",
  isabella: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/zmcOqESmOkWpEIaY.jpg",
  charles: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/IUoKhswtpjzMUspy.jpg",
  rebecca: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/pJbOJpMuUkxEPlsT.jpg",
  julia: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/TJmVqiVERkIKgPWV.png",
  susan: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/mCIaNOBovwoMGXio.jpg",
  martha_flandrau: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/SEMUIkdNLYjFUYJm.jpg",
  tilden: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/iQyKkOmpzwwNvTuu.jpg",
  sarah: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/ZNOcOzovpxxQQDWh.jpg",
  isabellaSelmes: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/CsGmHFmjXEkvYpLs.png",
  robertFerguson: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/RZwmTcGQHqQjTtXc.jpg",
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
    name: "Susannah Bell Dinsmore",
    dates: "1761 – 1807",
    role: "James's Mother",
    bioUrl: "https://www.dinsmorefarm.org/the-family/susannah-dinsmore/",
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

After his release, he rebuilt his fortune through various business ventures. He married Jane Macomb (née Navarre) and had several children, including Martha, who would marry James Dinsmore. Alexander died in 1831 in Georgetown, D.C., where he had moved to be near his son, Major General Alexander Macomb, who served as Commanding General of the United States Army.`,
  },
  janet: {
    id: "janet",
    name: "Janet Macomb",
    dates: "1761 – ?",
    role: "Martha's Mother",
    bioUrl: "https://www.dinsmorefarm.org/the-family/janet-macomb/",
    overview: "Born in New Providence, Bahamas in 1761. First married John Rucker, then Alexander Macomb in 1791. Mother of Martha Macomb Dinsmore and seven other children.",
    fullBio: `Janet (Jane) Navarre was born on August 1761 in New Providence, Bahamas. She was quite young when her father died. Her mother moved the family to New York City where she was remarried to John Ramsay, a merchant of the city. She and her older sister, Margaret, were soon joined by six more Ramsay siblings. When young, Jane split her time between Manhattan, Philadelphia, and Elizabeth Town, New Jersey.

In the 1780s, she was married to John Rucker, a German immigrant and wealthy merchant of the firm Constable & Rucker Company. She had only one son, John, before her husband died. In 1791 she married again, this time to Alexander Macomb, another merchant and also a sometime business partner of Constable. She had seven more children. After her husband gave up or lost his business concerns in New York City, the couple moved to Georgetown, D.C. where they could be near Alexander's son and namesake.`,
  },
  silas: {
    id: "silas",
    name: "Silas Dinsmoor",
    dates: "1766 – 1847",
    role: "James's Uncle",
    img: CDN.silas,
    bioUrl: "https://www.dinsmorefarm.org/the-family/silas-dinsmoor/",
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
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-macomb/",
    overview: "Born in 1797 in New Jersey. Married James Dinsmore in May 1829. Together they had three daughters: Isabella (1830), Julia (1833), and Susan (1835). Died in 1859 at the Homestead.",
    fullBio: `Martha Macomb was born in 1797 in Burlington, New Jersey, the daughter of Alexander Macomb, Sr. and Janet Navarre. She married James Dinsmore in May 1829. The couple initially lived in Louisiana before moving to Boone County, Kentucky in 1842.

Martha and James had three daughters: Isabella Ramsay (1830), Julia Stockton (1833), and Susan Bell (1835). Martha managed the household of the large farm and was known for her hospitality. She died in 1859 at the Homestead, leaving James and their daughters to carry on the family legacy.`,
  },
  isabella: {
    id: "isabella",
    name: "Isabella Dinsmore",
    dates: "1830 – 1867",
    role: "Eldest Daughter",
    img: CDN.isabella,
    bioUrl: "https://www.dinsmorefarm.org/the-family/isabella-dinsmore/",
    overview: "Eldest daughter of James and Martha Dinsmore. Married her first cousin Charles Flandrau in 1859 in the Dinsmore parlor. Had two daughters: Martha 'Patty' (1861) and Sarah 'Sally' (1867). Died in 1866, never fully recovering from childbirth.",
    fullBio: `Isabella Ramsay Dinsmore was the eldest daughter of James and Martha Dinsmore, born in 1830 in Louisiana. She married her first cousin, Charles Eugene Flandrau, in 1859. The wedding ceremony was held in the Dinsmore parlor and was probably followed by a large dinner for family and friends.

They had two daughters: Martha Macomb ('Patty') in 1861 and Sarah Gibson ('Sally') in 1867. Tragically, Isabella died in 1866, having never fully recovered from childbirth six months before. She was buried in Kentucky and her daughters Patty and Sally were raised by their Aunt Julia at the Homestead.`,
  },
  charles: {
    id: "charles",
    name: "Charles Flandrau",
    dates: "1828 – 1903",
    role: "Isabella's Husband",
    img: CDN.charles,
    bioUrl: "https://www.dinsmorefarm.org/the-family/charles-flandrau/",
    overview: "A lawyer who became influential in Minnesota Territory. Married his first cousin Isabella Dinsmore in 1859. After Isabella's death in 1866, he married Rebecca Blair Riddle in 1870. Served on the Minnesota Supreme Court and led the defense of New Ulm during the Dakota War.",
    fullBio: `Charles Eugene Flandrau was a lawyer who became influential in Minnesota Territory after moving there in 1853 from New York City. In 1859 he married his first cousin, Isabella Dinsmore. They had two daughters: Martha Macomb ('Patty') in 1861 and Sarah Gibson ('Sally') in 1867.

In 1862, during the Dakota War, Flandrau enlisted to defend settlers at New Ulm as part of the Union Army. His leadership earned him an appointment to head the defense of southwest Minnesota as a colonel. His career included serving on the Minnesota Territorial Council, in the Minnesota Constitutional Convention, and on the Minnesota territorial and state supreme courts.

In 1866, his wife, Isabella, died, having never fully recovered from childbirth six months before. She was buried in Kentucky and Patty and Sally were raised in Kentucky by their Aunt Julia. Charles went on to remarry Rebecca Blair Riddle, a widow with one son, John Wallace Riddle, Jr., and together they had two more children, Charles Macomb and William Blair McClure. In 1870, he moved to St. Paul, where he practiced law until the 1890s.`,
  },
  rebecca: {
    id: "rebecca",
    name: "Rebecca Blair",
    dates: "1839 – 1911",
    role: "Charles's 2nd Wife",
    img: CDN.rebecca,
    bioUrl: "https://www.dinsmorefarm.org/the-family/rebecca-blair/",
    overview: "Born near Pittsburgh, Pennsylvania. Well-educated and fluent in several languages. First married John Wallace Riddle (d. 1863). Married the widower Charles Flandrau in 1870. They had two children together. Played a prominent role in the Mt. Vernon Ladies Association.",
    fullBio: `Rebecca Blair McClure was born near Pittsburgh, Pennsylvania to Judge William and Lydia S. Collins McClure. She was well-educated and knew several foreign languages. In the early 1860s, she was married to John Wallace Riddle of Philadelphia. Riddle was the great nephew of Horace Binney, a well-known lawyer and Whig politician. In 1863, Riddle died at 25 years old, leaving the pregnant Rebecca a young widow. John W. Riddle, Jr. was born in 1864 (he later married Theodate Pope, one of the first female architects and a survivor of the Lusitania).

Seeking a healthier climate for herself, Rebecca took her son to St. Paul in 1870. There she met the widower, Charles E. Flandrau and they married later that year. The couple had two children together, Charles Macomb and William Blair, husband of Grace H. Flandrau. Rebecca traveled to Europe several times and played a prominent role in the early years of the Mt. Vernon Ladies Association. She died in St. Paul.`,
  },
  julia: {
    id: "julia",
    name: "Julia Dinsmore",
    dates: "1833 – 1926",
    role: "Second Daughter",
    img: CDN.julia,
    bioUrl: "https://www.dinsmorefarm.org/the-family/julia-dinsmore/",
    overview: "Second daughter of James and Martha. Never married. Raised her nieces Patty and Sally after Isabella's death. Inherited and preserved the Homestead. Published poet — her volume 'Verses and Sonnets' was published by Doubleday in 1910. Died in 1926 at age 93.",
    fullBio: `James' and Martha's second child, Julia, was born in 1833, in Terrebonne Parish, Louisiana. Julia was 9 years old when her family moved up the Mississippi and Ohio Rivers from Terrebonne Parish to their new home in the Belleview Bottoms section of Boone County.

Julia was well read in English verse and French Fiction. She began publishing poetry when she was in her fifties. Many of her poems appeared in the New Orleans Times Democrat. A volume of her poetry, entitled Verses and Sonnets, was published by Doubleday in 1910.

Her sister, Isabella, married a first cousin and died shortly after the birth of their second child. Their father, Charles Flandrau, sent the children to the farm in Kentucky to be raised by their Aunt Julia. Julia's younger sister, Susan Bell, drowned in a boating accident. Thus, by the time her father died in 1872, Julia Dinsmore had lost all of her immediate family and was left with two nieces to raise and a mediocre farm to manage.

Julia's tenacity and determination was pivotal in creating what is Dinsmore Farm today, a uniquely preserved historical site that captures the life of a family over five generations during our nation's formative years. There are over 90,000 letters and documents that bring to life a home that is almost as it was in 1842 when the family first moved to Boone County.

Julia never married but cared for many in her lifetime as though they were her own. She died on April 19, 1926 while visiting Isabella Greenway in Santa Barbara, California. She is buried in the Dinsmore Graveyard.`,
  },
  susan: {
    id: "susan",
    name: "Susan Dinsmore",
    dates: "1835 – 1851",
    role: "Youngest Daughter",
    img: CDN.susan,
    bioUrl: "https://www.dinsmorefarm.org/the-family/susan-dinsmore/",
    overview: "Youngest daughter of James and Martha, born in 1835 in Louisiana. Tragically drowned in a boating accident at age 16 while visiting cousins in Ripley, New York in July 1851.",
    fullBio: `Susan Bell Dinsmore was the youngest daughter of James and Martha Dinsmore, born in 1835 in Terrebonne Parish, Louisiana. She moved with her family to Boone County, Kentucky in 1842 when she was seven years old.

Susan was tutored at home by Ms. Eugenia Wadsworth from New York. She learned to play the piano and studied astronomy along with reading, spelling, mathematics, history, and geography. When her tutor married, Susan's older sister Isabella took over her education.

Tragically, in June 1851, Susan traveled to visit cousins in Ripley, New York. On July 21st, while boating on the lake with her cousin Mary Ann Goodrich, the boat began taking on water. Both Susan and Mary Ann drowned. She was only 16 years old. Her father James wrote to Martha, "We must remember that altho' we may sorely miss the society of our darling child here, we have an Angel child in heaven." Susan is buried in the Dinsmore family graveyard.`,
  },
  martha_flandrau: {
    id: "martha_flandrau",
    name: "Martha 'Patty' Flandrau",
    dates: "1861 – 1923",
    role: "Isabella & Charles's Daughter",
    img: CDN.martha_flandrau,
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-flandrau/",
    overview: "Born August 14, 1861 at the Dinsmore Homestead while the Civil War was beginning. Raised by her Aunt Julia after her mother's death. Married Tilden Selmes in 1883. Mother of Isabella Selmes.",
    fullBio: `In the summer of 1861, as the Civil War was beginning, Isabella Dinsmore Flandrau traveled from her home in Minnesota to Boone County to stay with her father and sister, Julia, while she prepared to give birth to her first child. On August 14th, in a large corner room of the house, Martha Macomb Flandrau was born. Named for her grandmother, her nickname became Patty, and she was doted on by her grandfather, James, and her Aunt Julia.

After her mother Isabella's death in 1866, Patty was raised at the Homestead by her Aunt Julia. She married Tilden Russell Selmes in 1883 and they had one daughter, Isabella, born at the Dinsmore farm in 1886. After Tilden's death in 1895, Patty struggled with her health and finances but remained devoted to her daughter and the extended family. She died in 1923.`,
  },
  tilden: {
    id: "tilden",
    name: "Tilden Selmes",
    dates: "1853 – 1895",
    role: "Patty's Husband",
    img: CDN.tilden,
    bioUrl: "https://www.dinsmorefarm.org/the-family/tilden-selmes/",
    overview: "Born in 1853 in Hannibal, Missouri. His father was a wealthy merchant who outfitted pioneers heading west. Married Martha 'Patty' Flandrau in 1883. Father of Isabella Selmes. Died in 1895.",
    fullBio: `Tilden Russell Selmes was born in 1853, the eldest son of Tilden R. and Sarah Benton Selmes. His father was an English immigrant whose first wife had died. As a widower with a married daughter by the time of his 1850 marriage to Sarah, he was quite a bit older than she. Tilden, Jr. was born in Hannibal, Missouri, where his father had become a wealthy merchant and banker who was prominent for his role in outfitting the pioneers who ventured on the overland trails west.

Tilden married Martha 'Patty' Flandrau in 1883. Their daughter Isabella was born at the Dinsmore farm in 1886. Tilden died in 1895, leaving Patty a widow with their young daughter.`,
  },
  sarah: {
    id: "sarah",
    name: "Sarah 'Sally' Flandrau",
    dates: "1867 – 1947",
    role: "Isabella & Charles's Daughter",
    img: CDN.sarah,
    bioUrl: "https://www.dinsmorefarm.org/the-family/sarah-flandrau/",
    overview: "Born in Kentucky, only six months old when her mother died in 1867. Raised by Aunt Julia. Attended Miss Porter's school. Married Frank Cutcheon in 1891. Remained close to her niece Isabella Selmes throughout her life.",
    fullBio: `Sally was born in Kentucky and only six months old when her mother died in 1867. Julia S. Dinsmore raised her from an infant and because of the child's asthma, Julia constantly fretted over her health and kept her out of school much of the time. When she was in her teens, Sally was sent to Miss Porter's school in Connecticut.

Like her sister, she began spending more time in St. Paul as she grew older and was quite the belle, with parties, sledding, and tennis to take up her time. In 1891 she married Frank Cutcheon, a young lawyer in her father's firm. The couple, who remained childless, moved to New York City in 1895 where Frank became very successful.

When their niece, Isabella Greenway, was sixteen, they invited her and her mother to live with them and Frank helped pay for Isabella's education. The relationship between Sally, Frank, and Isabella remained close. After Isabella purchased a home in Santa Barbara, California, Sally and Frank bought one nearby. That is where Sally died years later. She is buried in the Dinsmore Graveyard.`,
  },
  frank: {
    id: "frank",
    name: "Frank Cutcheon",
    dates: "1864 – 1936",
    role: "Sally's Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/frank-cutcheon/",
    overview: "Born March 6, 1864 in Dexter, Michigan. Son of a distinguished Brigadier General. Became a successful New York attorney. Married Sarah 'Sally' Flandrau in 1891. Helped raise and educate their niece Isabella Selmes.",
    fullBio: `Born on March 6, 1864, Frank Cutcheon was the son of Byron and Marie Annie Warner Cutcheon of Dexter, Michigan. His father was a distinguished Brigadier General in the Union Army and a recipient of the Medal of Valor. Following the war, Byron studied law at the University of Michigan and then began a lengthy political career, serving four terms in Congress.

Frank followed his father into law and joined Charles Flandrau's firm in St. Paul, where he met and married Sally Flandrau in 1891. The couple moved to New York City in 1895 where Frank became a very successful attorney. They remained childless but played an important role in raising their niece Isabella Selmes, helping pay for her education and welcoming her into their home.`,
  },
  isabellaSelmes: {
    id: "isabellaSelmes",
    name: "Isabella Selmes",
    dates: "1886 – 1953",
    role: "Patty & Tilden's Daughter",
    img: CDN.isabellaSelmes,
    bioUrl: "https://www.dinsmorefarm.org/the-family/isabella-selmes/",
    overview: "Born at the Dinsmore farm on March 22, 1886. Attended Miss Chapin's School where she met Eleanor Roosevelt. Married three times: Robert Ferguson (1905), John Greenway (1923), and Harry King (1939). Served in the U.S. Congress. A remarkable woman of the American West.",
    fullBio: `Isabella Selmes was born at the Dinsmore farm on March 22, 1886. She attended Miss Chapin's School in New York City where she became close friends with Eleanor Roosevelt — a friendship that would last their entire lives.

She married Robert H. M. Ferguson in 1905. They had two children: Martha (1906) and Robert 'Bob' (1908). After Robert's death in 1922, she married John Campbell Greenway in 1923 and they had a son, Jack (1924). John Greenway died in 1926.

Isabella became a successful businesswoman in Arizona, running a cattle ranch and founding the Arizona Inn in Tucson. She was elected to the U.S. House of Representatives in 1933, serving one term. In 1939, she married Harry King. Isabella was known for her warmth, determination, and her deep connections to both the Roosevelt and Dinsmore families. She died in 1953.`,
  },
  robertFerguson: {
    id: "robertFerguson",
    name: "Robert Ferguson",
    dates: "1867 – 1922",
    role: "Isabella Selmes's 1st Husband",
    img: CDN.robertFerguson,
    bioUrl: "https://www.dinsmorefarm.org/the-family/robert-ferguson/",
    overview: "Scottish-born rancher and close friend of Theodore Roosevelt. Married Isabella Selmes in 1905. Father of Martha and Robert 'Bob' Ferguson. Diagnosed with tuberculosis in 1908. Died in 1922.",
    fullBio: `Robert Harry Munro Ferguson was born in Scotland in 1867. He came to America and became a rancher in the West. Through Anna Roosevelt Cowles, he met Theodore Roosevelt and the two became close friends, hunting together on several occasions.

Bob married Isabella Selmes in 1905. They had two children: Martha Munro Ferguson (1906) and Robert Munro Ferguson (1908). In 1908, Robert was diagnosed with tuberculosis, and the family spent time in the Adirondacks seeking treatment. Despite his illness, he remained active and devoted to his family. Theodore Roosevelt served as godfather to his son. Robert died in 1922.`,
  },
  johnGreenway: {
    id: "johnGreenway",
    name: "John Greenway",
    dates: "1872 – 1926",
    role: "Isabella Selmes's 2nd Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/john-greenway/",
    overview: "A decorated military officer and Arizona copper magnate. Married Isabella Selmes in 1923. Father of Jack S. Greenway. Died in 1926. His statue represents Arizona in the U.S. Capitol's Statuary Hall.",
    fullBio: `John Campbell Greenway was born in 1872. He was a decorated military officer who served with Theodore Roosevelt's Rough Riders in the Spanish-American War. After his military service, he became a prominent mining engineer and copper magnate in Arizona.

John married Isabella Selmes Ferguson in 1923. Their son, John Selmes 'Jack' Greenway, was born in 1924. Tragically, John died in 1926, just two years after his son's birth. He was so revered in Arizona that his statue was placed in the U.S. Capitol's Statuary Hall as one of the state's two representatives.`,
  },
  harryKing: {
    id: "harryKing",
    name: "Harry King",
    dates: "1890 – 1976",
    role: "Isabella Selmes's 3rd Husband",
    img: CDN.harryKing,
    bioUrl: "https://www.dinsmorefarm.org/the-family/harry-king/",
    overview: "Born in Chicago in 1890. Had a varied business career including working for Brockway Motor Company and as an early investor in Igor Sikorsky's helicopter ventures. Married Isabella in 1939. Buried in Fairfield, Connecticut.",
    fullBio: `Born in Chicago, Harry had a varied business career before becoming the third husband of Isabella Ferguson Greenway in 1939. Some of his jobs included working for one of the early truck manufacturers, Brockway Motor Company, and as Vice President of the Bassick Company in Connecticut, which manufactured car and truck parts. He was very interested in mining and served on the boards of several companies.

When Igor Sikorsky began experimenting in helicopters, it is said that Harry King was one of his investors. Isabella and Harry became acquainted when she was in Congress in the 1930s. During that time, Harry served in Roosevelt's National Recovery Administration and, during the war, on the War Production Board. Isabella was his second wife, his first marriage having ended in divorce. The couple split their time between Tucson, Arizona, and New York. Harry is buried in Fairfield, Connecticut.`,
  },
  marthaFerguson: {
    id: "marthaFerguson",
    name: "Martha Ferguson",
    dates: "1906 – 1994",
    role: "Isabella Selmes's Daughter",
    img: CDN.marthaFerguson,
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-ferguson/",
    overview: "First child of Robert and Isabella Selmes Ferguson, born September 4, 1906 in Locust Valley, Long Island. Nearly inseparable from her brother Bobby growing up. Married George Breed Breasted.",
    fullBio: `Martha Munro Ferguson was the first child born to Robert and Isabella Selmes Ferguson. She entered the world on September 4, 1906, in her great-Aunt Sally's house in Locust Valley on Long Island. A year and a half later, her brother, Bobby (or Buzz), joined her and the two of them were almost inseparable as they were growing up.

In 1908, Martha's father was diagnosed with tuberculosis, so her mother and father spent two years in the Adirondacks hoping to get him some relief. The children were raised amid the challenges of their father's illness and the family's frequent moves between the East Coast and the American West. Martha married George Breed Breasted and lived a long life, dying in 1994.`,
  },
  bobFerguson: {
    id: "bobFerguson",
    name: "Robert 'Bob' Ferguson",
    dates: "1908 – 1984",
    role: "Isabella Selmes's Son",
    img: CDN.bobFerguson,
    bioUrl: "https://www.dinsmorefarm.org/the-family/robert-bob-ferguson/",
    overview: "Born March 13, 1908. Theodore Roosevelt was his godfather. Grew up close to his sister Martha. Named after his father, Robert H. M. Ferguson.",
    fullBio: `Isabella Ferguson and her first husband, Robert H. M. Ferguson, had their second child Robert Munro ('Bobbie', later 'Bob'), on March 13, 1908. Robert, Sr. asked his old friend and comrade, Theodore Roosevelt, to be his son's godfather. Roosevelt gladly accepted. This was yet another tie that brought these families closer together.

Later Roosevelt would express his gratitude not only for their friendship but for the influence the Fergusons had on his own children's lives. Bob grew up close to his sister Martha and was raised amid the challenges of his father's tuberculosis and the family's moves between the East and West. He died in 1984.`,
  },
  jackGreenway: {
    id: "jackGreenway",
    name: "Jack S. Greenway",
    dates: "1924 – 1995",
    role: "Isabella Selmes's Son",
    img: CDN.jackGreenway,
    bioUrl: "https://www.dinsmorefarm.org/the-family/jack-greenway/",
    overview: "Born October 11, 1924 in Santa Barbara, California. Named for his father John Campbell Greenway and maternal grandfather Tilden Selmes. Weighed ten pounds at birth with blond hair and blue eyes.",
    fullBio: `John Selmes Greenway, named for his father and his maternal grandfather, was born on the 11th of October 1924, in Santa Barbara, California. He weighed in at ten pounds and in looks he favored his father's side of the family, with blond hair and eyes that remained blue. His parents, John Campbell and Isabella Selmes Ferguson Greenway, could not have been more proud.

While they had only been married for a year, they had been in love for a much longer time. Tragically, Jack's father died in 1926 when Jack was only two years old. Jack was raised by his mother Isabella and grew up in Arizona. He died in 1995.`,
  },
};

// ─── Tree Structure (CORRECTED) ──────────────────────────────────────────────
interface TreeCouple {
  left: string;
  right?: string;
  marriage?: string;
  note?: string;
}

interface TreeGeneration {
  label: string;
  couples: TreeCouple[];
}

const GENERATIONS: TreeGeneration[] = [
  {
    label: "Generation I — Grandparents",
    couples: [
      { left: "johnJr", right: "susannah" },
      { left: "alexander", right: "janet" },
    ],
  },
  {
    label: "Generation II — Patriarch & Matriarch",
    couples: [
      { left: "silas", note: "Uncle" },
      { left: "james", right: "martha", marriage: "m. 1829" },
    ],
  },
  {
    label: "Generation III — Children",
    couples: [
      { left: "isabella", right: "charles", marriage: "m. 1859" },
      { left: "rebecca", right: "charles", marriage: "m. 1870", note: "2nd wife" },
      { left: "julia" },
      { left: "susan" },
    ],
  },
  {
    label: "Generation IV — Grandchildren",
    couples: [
      { left: "martha_flandrau", right: "tilden", marriage: "m. 1883" },
      { left: "sarah", right: "frank", marriage: "m. 1891" },
    ],
  },
  {
    label: "Generation V — Great-Grandchildren",
    couples: [
      { left: "isabellaSelmes", right: "robertFerguson", marriage: "m. 1905", note: "#1" },
      { left: "isabellaSelmes", right: "johnGreenway", marriage: "m. 1923", note: "#2" },
      { left: "isabellaSelmes", right: "harryKing", marriage: "m. 1939", note: "#3" },
    ],
  },
  {
    label: "Generation VI — Great-Great-Grandchildren",
    couples: [
      { left: "marthaFerguson" },
      { left: "bobFerguson" },
      { left: "jackGreenway" },
    ],
  },
];

// ─── Portrait Component ───────────────────────────────────────────────────────
function Portrait({
  member,
  size = "md",
  onClick,
  highlighted,
}: {
  member: Member;
  size?: "sm" | "md" | "lg";
  onClick: (m: Member) => void;
  highlighted?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const sizeMap = { sm: "w-16 h-16", md: "w-20 h-20 md:w-24 md:h-24", lg: "w-28 h-28 md:w-32 md:h-32" };
  const textSize = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" };
  const isActive = hovered || highlighted;

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
        <motion.div
          className={`absolute -inset-1 rounded-full`}
          animate={{
            boxShadow: isActive
              ? "0 0 0 3px #c9a84c, 0 0 24px rgba(201,168,76,0.6)"
              : "0 0 0 2px rgba(201,168,76,0.2)",
          }}
          transition={{ duration: 0.25 }}
          style={{ borderRadius: "50%" }}
        />
        <div
          className={`${sizeMap[size]} rounded-full overflow-hidden border-2 relative`}
          style={{
            borderColor: isActive ? "#c9a84c" : "rgba(201,168,76,0.3)",
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
                filter: isActive ? "brightness(1.15) contrast(1.05)" : "brightness(0.9) sepia(0.1)",
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
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }}
          />
        </div>
      </div>
      <div className="mt-2 text-center max-w-[100px] md:max-w-[120px]">
        <p
          className={`${textSize[size]} font-semibold text-[#1a2f4e] leading-tight`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {member.name}
        </p>
        {member.dates && (
          <p className="text-[10px] text-[#6b5744] mt-0.5" style={{ fontFamily: "'EB Garamond', serif" }}>
            {member.dates}
          </p>
        )}
        {member.role && (
          <p className="text-[9px] text-[#c9a84c] uppercase tracking-wide mt-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
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
    <div className="flex flex-col items-center justify-center self-start mt-8 md:mt-10 px-1 md:px-2">
      <div className="flex items-center gap-1">
        <div className="h-px w-3 md:w-5 bg-[#c9a84c]/50" />
        <span className="text-[10px] text-[#c9a84c] italic whitespace-nowrap" style={{ fontFamily: "'EB Garamond', serif" }}>
          {label}
        </span>
        <div className="h-px w-3 md:w-5 bg-[#c9a84c]/50" />
      </div>
      {note && (
        <span className="text-[8px] text-[#6b5744] mt-0.5" style={{ fontFamily: "'EB Garamond', serif" }}>
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
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-[#c9a84c]/20" />
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#c9a84c] whitespace-nowrap"
          style={{ fontFamily: "'Cinzel', serif" }}>
          {gen.label}
        </span>
        <div className="h-px flex-1 bg-[#c9a84c]/20" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {gen.couples.map((couple, ci) => {
          const leftMember = MEMBERS[couple.left];
          const rightMember = couple.right ? MEMBERS[couple.right] : null;
          const showLeft = !shownIds.has(couple.left);
          const showRight = couple.right ? !shownIds.has(couple.right) : false;
          if (showLeft) shownIds.add(couple.left);
          if (showRight && couple.right) shownIds.add(couple.right);

          return (
            <div key={ci} className="flex items-start gap-1 md:gap-2">
              {showLeft && leftMember && (
                <Portrait member={leftMember} onClick={onSelect} />
              )}
              {couple.marriage && (
                <MarriageConnector label={couple.marriage} note={couple.note} />
              )}
              {!couple.marriage && couple.note && !couple.right && (
                <div className="flex items-center self-start mt-8 px-1">
                  <span className="text-[9px] text-[#6b5744] italic" style={{ fontFamily: "'EB Garamond', serif" }}>
                    {couple.note}
                  </span>
                </div>
              )}
              {showRight && rightMember && (
                <Portrait member={rightMember} onClick={onSelect} />
              )}
            </div>
          );
        })}
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

  // Order for bio section: follow the generations
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
      <div className="relative py-16 md:py-20 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2f4e 0%, #0f1e30 50%, #2d4a1e 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M0,150 Q300,50 600,150 Q900,250 1200,150" stroke="#c9a84c" strokeWidth="2" fill="none" />
            <path d="M0,100 Q300,200 600,100 Q900,0 1200,100" stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            The Dinsmore Family
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Family Tree
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg" style={{ fontFamily: "'EB Garamond', serif" }}>
            Explore the immediate Dinsmore family members — those who lived on or visited the farm,
            or who had close ties to those who lived there. Click on any portrait to learn more.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-white/40 text-sm">
            <span>Est. 1842</span><span>·</span><span>Burlington, Kentucky</span><span>·</span><span>6 Generations</span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <p className="text-[#4a3728] text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'EB Garamond', serif" }}>
            The Dinsmore Homestead has been home to six generations of one remarkable family.
            Hover over any portrait to highlight a family member, then click to read their biography.
          </p>
        </div>

        {/* Central spine */}
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15) 10%, rgba(201,168,76,0.15) 90%, transparent)" }} />
          <div className="space-y-12 md:space-y-16">
            {GENERATIONS.map((gen, gi) => (
              <GenerationRow key={gi} gen={gen} onSelect={setSelected} />
            ))}
          </div>
        </div>

        {/* Scroll to bios CTA */}
        <div className="text-center mt-16">
          <button
            onClick={scrollToBios}
            className="inline-flex flex-col items-center gap-2 text-[#1a2f4e] hover:text-[#c9a84c] transition-colors"
          >
            <span className="text-xs uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
              Read Full Biographies
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Full Biographies Section */}
      <div ref={biosRef} className="scroll-mt-8">
        <div className="py-16 md:py-20" style={{ background: "rgba(26,47,78,0.03)" }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-[#c9a84c] text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                Complete Biographies
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a2f4e] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                The Family Members
              </h2>
              <p className="text-[#4a3728] max-w-2xl mx-auto" style={{ fontFamily: "'EB Garamond', serif" }}>
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#c9a84c]/40 text-[#1a2f4e] hover:bg-[#c9a84c]/10 transition-colors text-sm"
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
