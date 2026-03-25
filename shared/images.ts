// CDN URLs for all Dinsmore Homestead images
// Uploaded from scraped assets at dinsmorefarm.org

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv";

export const IMAGES = {
  // Logo
  logo: `${CDN}/DIN_DinsmoreHomestead-LOGO_Reversed_2b0666c3.png`,

  // Hero / Landscape
  farmHDR: `${CDN}/Dinsmore-Farm-HDR-Web-23_93b0d27f.jpg`,
  outbuildings8: `${CDN}/dinsmore-outbuildings-8_299527e9.jpg`,
  outbuildings14: `${CDN}/dinsmore-outbuildings-14_c459bf7f.jpg`,
  farmSlim: `${CDN}/UpdatedDinsmore_slim-scaled_1676094e.jpg`,
  farmPhoto1: `${CDN}/UpdatedDinsmore_Photo-1-1-2-scaled_90986adb.jpg`,
  farmPhoto2: `${CDN}/UpdatedDinsmore_Photo-2-1-2-scaled_1b7dc483.jpg`,
  homestead: `${CDN}/homestead_311a9537.jpg`,
  heritageFinal: `${CDN}/DINSMORE-HERITAGE-FINAL_trimmed-scaled_f74e4538.jpg`,
  drone: `${CDN}/dinsmore-drone_023eecfc.jpg`,
  graveyard: `${CDN}/graveyard_2623a24f.jpg`,
  frontHall: `${CDN}/Dinsmore-Farm-Front-Hall_596bdb01.jpg`,
  outsideWedding: `${CDN}/dinsmore-outside-wedding_707257db.jpg`,
  volunteers: `${CDN}/dinsmore-volunteers_281ae565.jpg`,
  marthaPortrait: `${CDN}/martha-tilt-shadow-1024x872_94d9e88d.jpg`,

  // Family Portraits
  jamesDinsmore: `${CDN}/james-dinsmore_96321c6d.jpg`,
  juliaStockton: `${CDN}/Julia-Stockton-Dinsmore_cc337b15.png`,
  marthaMacomb: `${CDN}/martha_macomb_44770efc.jpg`,
  alexanderMacomb: `${CDN}/Alexander-Macomb_90e538f9.png`,
  isabellaSelmes: `${CDN}/Isabella-Selmes-Ferguson-Greenway-King_eb799179.png`,
  isabellaDinsmore: `${CDN}/Isabella-Dinsmore-Flandrau_4b0b30ed.jpg`,
  nancyMcGruder: `${CDN}/Nancy-McGruder_f7b50755.jpg`,
  nancyMcGruderFarm: `${CDN}/Nancy_Mcgruder_Dinsmore_Farm_94361274.jpg`,
  juliaFarleyLoving: `${CDN}/Julia_Farley_Loving_e1210fd3.jpg`,
  susanBell: `${CDN}/Susan-Bell-Dinsmore_01e54a93.jpg`,
  graceHodgson: `${CDN}/Grace-Hodgson-Flandrau_dce06e3d.png`,
  charlesFlandrau: `${CDN}/Charles-Blair-Flandrau_92741135.png`,
  johnRiddle: `${CDN}/John-Wallace-Riddle-Jr_c2fe1003.jpg`,
  roseberry: `${CDN}/roseberry_2e5f6822.jpg`,
  harrisSussie: `${CDN}/harry-sussie-roseberry_582d3280.jpg`,

  // Farm Life
  harryAtCabin: `${CDN}/harry-at-cabin-245x300_b4fe501e.jpg`,
  cabin: `${CDN}/cabin-300x225_668b30ae.jpg`,
  insideKitchen: `${CDN}/inside-kitchen-225x300_90313936.jpg`,

  // Events
  derbyDay: `${CDN}/Dinsmore-Derby-Day-2025-Invite-Final-3-1-300x300_258746ec.jpg`,
  christmasCountry: `${CDN}/Dinsmore-Christmas-In-The-Country-2025-scaled-300x300_75845e37.jpg`,
  beyondTheVeil: `${CDN}/Dinsmore-Beyond-the-veil-Flyer-2025_Page_1-300x300_d8354248.jpg`,
  summerPrograms: `${CDN}/Screenshot-2025-02-20-155248_38d41e5e.png`,
} as const;

export type ImageKey = keyof typeof IMAGES;
