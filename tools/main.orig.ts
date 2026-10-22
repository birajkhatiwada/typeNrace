// @ts-nocheck
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import colormapUrl from './assets/colormap.png';
import gStraight from './assets/track-straight.glb';
import gCorner from './assets/track-corner.glb';
import gFinish from './assets/track-finish.glb';
import gForest from './assets/decoration-forest.glb';
import gEmpty from './assets/decoration-empty.glb';
import gRed from './assets/vehicle-truck-red.glb';
import gYellow from './assets/vehicle-truck-yellow.glb';
import gGreen from './assets/vehicle-truck-green.glb';
import gPurple from './assets/vehicle-truck-purple.glb';
import gBike from './assets/vehicle-motorcycle.glb';
import cityTex from './assets/city/colormap.png';
import comTex from './assets/com/colormap.png';
import m_building_a from './assets/com/building-a.glb';
import m_building_b from './assets/com/building-b.glb';
import m_building_d from './assets/com/building-d.glb';
import m_building_f from './assets/com/building-f.glb';
import m_building_g from './assets/com/building-g.glb';
import m_building_h from './assets/com/building-h.glb';
import m_building_i from './assets/com/building-i.glb';
import m_building_l from './assets/com/building-l.glb';
import m_building_m from './assets/com/building-m.glb';
import m_building_skyscraper_a from './assets/com/building-skyscraper-a.glb';
import m_building_skyscraper_c from './assets/com/building-skyscraper-c.glb';
import m_building_skyscraper_d from './assets/com/building-skyscraper-d.glb';
import m_building_skyscraper_e from './assets/com/building-skyscraper-e.glb';
import m_low_detail_building_a from './assets/com/low-detail-building-a.glb';
import m_low_detail_building_c from './assets/com/low-detail-building-c.glb';
import m_low_detail_building_g from './assets/com/low-detail-building-g.glb';
import m_low_detail_building_h from './assets/com/low-detail-building-h.glb';
import m_low_detail_building_m from './assets/com/low-detail-building-m.glb';
import s_platform_straight from './assets/space/platform_straight.glb';
import s_platform_cornerRound from './assets/space/platform_cornerRound.glb';
import s_hangar_largeA from './assets/space/hangar_largeA.glb';
import s_hangar_largeB from './assets/space/hangar_largeB.glb';
import s_hangar_roundA from './assets/space/hangar_roundA.glb';
import s_hangar_smallA from './assets/space/hangar_smallA.glb';
import s_hangar_smallB from './assets/space/hangar_smallB.glb';
import s_satelliteDish_large from './assets/space/satelliteDish_large.glb';
import s_satelliteDish from './assets/space/satelliteDish.glb';
import s_rocket_baseA from './assets/space/rocket_baseA.glb';
import s_rocket_sidesA from './assets/space/rocket_sidesA.glb';
import s_rocket_topA from './assets/space/rocket_topA.glb';
import s_rocket_finsA from './assets/space/rocket_finsA.glb';
import s_rocket_fuelA from './assets/space/rocket_fuelA.glb';
import s_rock_crystalsLargeA from './assets/space/rock_crystalsLargeA.glb';
import s_rock_crystalsLargeB from './assets/space/rock_crystalsLargeB.glb';
import s_rock_largeA from './assets/space/rock_largeA.glb';
import s_rock_largeB from './assets/space/rock_largeB.glb';
import s_rocks_smallA from './assets/space/rocks_smallA.glb';
import s_rocks_smallB from './assets/space/rocks_smallB.glb';
import s_crater from './assets/space/crater.glb';
import s_craterLarge from './assets/space/craterLarge.glb';
import s_meteor from './assets/space/meteor.glb';
import s_meteor_half from './assets/space/meteor_half.glb';
import s_gate_complex from './assets/space/gate_complex.glb';
import s_machine_generatorLarge from './assets/space/machine_generatorLarge.glb';
import s_machine_wireless from './assets/space/machine_wireless.glb';
import s_structure_detailed from './assets/space/structure_detailed.glb';
import s_turret_double from './assets/space/turret_double.glb';
import s_supports_low from './assets/space/supports_low.glb';
import s_rover from './assets/space/rover.glb';
import s_astronautA from './assets/space/astronautA.glb';
import s_barrels from './assets/space/barrels.glb';
import s_craft_speederA from './assets/space/craft_speederA.glb';
import s_craft_cargoA from './assets/space/craft_cargoA.glb';
import s_monorail_trackStraight from './assets/space/monorail_trackStraight.glb';
import s_monorail_trackSupport from './assets/space/monorail_trackSupport.glb';
import s_terrain from './assets/space/terrain.glb';
import s_terrain_side from './assets/space/terrain_side.glb';
import s_terrain_ramp from './assets/space/terrain_ramp.glb';
import s_monorail_trainFront from './assets/space/monorail_trainFront.glb';
import s_monorail_trainPassenger from './assets/space/monorail_trainPassenger.glb';
import s_monorail_trainEnd from './assets/space/monorail_trainEnd.glb';
import s_pipe_straight from './assets/space/pipe_straight.glb';
import s_pipe_end from './assets/space/pipe_end.glb';
import s_pipe_ring from './assets/space/pipe_ring.glb';
import s_pipe_supportLow from './assets/space/pipe_supportLow.glb';
import s_craft_speederC from './assets/space/craft_speederC.glb';
import s_astronautB from './assets/space/astronautB.glb';
import s_rocket_fuelB from './assets/space/rocket_fuelB.glb';
import s_rocket_baseB from './assets/space/rocket_baseB.glb';
import s_pipe_cornerRound from './assets/space/pipe_cornerRound.glb';
import s_terrain_roadStraight from './assets/space/terrain_roadStraight.glb';
import s_terrain_roadCorner from './assets/space/terrain_roadCorner.glb';
import boatTex from './assets/boat/colormap.png';
import b_boat_speed_a from './assets/boat/boat-speed-a.glb';
import b_boat_speed_d from './assets/boat/boat-speed-d.glb';
import b_boat_speed_f from './assets/boat/boat-speed-f.glb';
import b_boat_speed_h from './assets/boat/boat-speed-h.glb';
import b_boat_speed_j from './assets/boat/boat-speed-j.glb';
import b_boat_tug_a from './assets/boat/boat-tug-a.glb';
import b_boat_sail_a from './assets/boat/boat-sail-a.glb';
import b_buoy from './assets/boat/buoy.glb';
import b_buoy_flag from './assets/boat/buoy-flag.glb';
import b_gate_finish from './assets/boat/gate-finish.glb';
import b_ship_small from './assets/boat/ship-small.glb';
import b_boat_house_a from './assets/boat/boat-house-a.glb';
import b_boat_fishing_small from './assets/boat/boat-fishing-small.glb';
import nr_grass from './assets/river/ground_grass.glb';
import nr_riverStraight from './assets/river/ground_riverStraight.glb';
import nr_riverBend from './assets/river/ground_riverBend.glb';
import nr_riverTile from './assets/river/ground_riverTile.glb';
import nr_riverRocks from './assets/river/ground_riverRocks.glb';
import indTex from './assets/ind/colormap.png';
import i_building_a from './assets/ind/building-a.glb';
import i_building_b from './assets/ind/building-b.glb';
import i_building_c from './assets/ind/building-c.glb';
import i_building_d from './assets/ind/building-d.glb';
import i_building_e from './assets/ind/building-e.glb';
import i_building_f from './assets/ind/building-f.glb';
import i_building_g from './assets/ind/building-g.glb';
import i_building_l from './assets/ind/building-l.glb';
import i_building_m from './assets/ind/building-m.glb';
import i_building_q from './assets/ind/building-q.glb';
import i_building_r from './assets/ind/building-r.glb';
import i_building_t from './assets/ind/building-t.glb';
import i_water_tower from './assets/ind/water-tower.glb';
import i_chimney_large from './assets/ind/chimney-large.glb';
import i_detail_tank_large from './assets/ind/detail-tank-large.glb';
import i_shipping_container_a from './assets/ind/shipping-container-a.glb';
import i_shipping_container_b from './assets/ind/shipping-container-b.glb';
import i_shipping_container_c from './assets/ind/shipping-container-c.glb';
import i_solar_panel_landscape_group from './assets/ind/solar-panel-landscape-group.glb';
import i_windmill from './assets/ind/windmill.glb';
import c_road_slant_high from './assets/city/road-slant-high.glb';
import c_road_slant_high_barrier from './assets/city/road-slant-high-barrier.glb';
import c_road_bridge from './assets/city/road-bridge.glb';
import c_bridge_pillar from './assets/city/bridge-pillar.glb';
import c_road_straight from './assets/city/road-straight.glb';
import c_road_bend from './assets/city/road-bend.glb';
import c_road_straight_barrier from './assets/city/road-straight-barrier.glb';
import c_road_bend_barrier from './assets/city/road-bend-barrier.glb';
import c_light_square from './assets/city/light-square.glb';
import c_light_curved from './assets/city/light-curved.glb';
import c_traffic_light from './assets/city/traffic-light.glb';
import c_construction_cone from './assets/city/construction-cone.glb';
import c_construction_barrier from './assets/city/construction-barrier.glb';
import c_road_sign_warning from './assets/city/road-sign-warning.glb';
import c_dumpster from './assets/city/dumpster.glb';
import c_road_curve from './assets/city/road-curve.glb';
import c_road_curve_barrier from './assets/city/road-curve-barrier.glb';
import c_road_roundabout from './assets/city/road-roundabout.glb';
import c_road_roundabout_barrier from './assets/city/road-roundabout-barrier.glb';
import c_road_slant_flat_high from './assets/city/road-slant-flat-high.glb';
import c_sign_highway from './assets/city/sign-highway.glb';
import c_sign_highway_wide from './assets/city/sign-highway-wide.glb';
import c_road_crossing from './assets/city/road-crossing.glb';
import c_road_crossroad from './assets/city/road-crossroad.glb';
import c_road_side from './assets/city/road-side.glb';
import c_light_curved_double from './assets/city/light-curved-double.glb';
import c_light_square_double from './assets/city/light-square-double.glb';
import c_road_sign_street from './assets/city/road-sign-street.glb';
import c_road_straight_half from './assets/city/road-straight-half.glb';
import n_cactus_tall from './assets/nature/cactus_tall.glb';
import n_cactus_short from './assets/nature/cactus_short.glb';
import n_tree_palmTall from './assets/nature/tree_palmTall.glb';
import n_tree_palm from './assets/nature/tree_palm.glb';
import n_rock_largeA from './assets/nature/rock_largeA.glb';
import n_rock_largeC from './assets/nature/rock_largeC.glb';
import n_rock_tallA from './assets/nature/rock_tallA.glb';
import n_rock_tallC from './assets/nature/rock_tallC.glb';
import n_stone_largeA from './assets/nature/stone_largeA.glb';
import n_stone_tallB from './assets/nature/stone_tallB.glb';
import n_stone_smallA from './assets/nature/stone_smallA.glb';
import n_tree_pineTallA from './assets/nature/tree_pineTallA.glb';
import n_tree_pineTallC_detailed from './assets/nature/tree_pineTallC_detailed.glb';
import n_tree_pineDefaultA from './assets/nature/tree_pineDefaultA.glb';
import n_tree_pineSmallA from './assets/nature/tree_pineSmallA.glb';
import n_tree_pineRoundC from './assets/nature/tree_pineRoundC.glb';
import n_tree_oak from './assets/nature/tree_oak.glb';
import n_tree_default from './assets/nature/tree_default.glb';
import n_plant_bush from './assets/nature/plant_bush.glb';
import n_plant_bushLarge from './assets/nature/plant_bushLarge.glb';
import n_flower_redA from './assets/nature/flower_redA.glb';
import n_flower_yellowA from './assets/nature/flower_yellowA.glb';
import n_flower_purpleA from './assets/nature/flower_purpleA.glb';
import n_stump_old from './assets/nature/stump_old.glb';
import n_log_large from './assets/nature/log_large.glb';
import n_cliff_block_rock from './assets/nature/cliff_block_rock.glb';
import n_cliff_waterfall_rock from './assets/nature/cliff_waterfall_rock.glb';
import n_tent_detailedOpen from './assets/nature/tent_detailedOpen.glb';
import n_tent_smallOpen from './assets/nature/tent_smallOpen.glb';
import n_campfire_logs from './assets/nature/campfire_logs.glb';
import n_canoe from './assets/nature/canoe.glb';
import n_log_stack from './assets/nature/log_stack.glb';
import n_crops_dirtDoubleRow from './assets/nature/crops_dirtDoubleRow.glb';
import n_crop_pumpkin from './assets/nature/crop_pumpkin.glb';
import n_crop_melon from './assets/nature/crop_melon.glb';
import n_crops_cornStageD from './assets/nature/crops_cornStageD.glb';
import n_crops_wheatStageB from './assets/nature/crops_wheatStageB.glb';
import n_statue_obelisk from './assets/nature/statue_obelisk.glb';
import n_statue_ring from './assets/nature/statue_ring.glb';
import n_statue_head from './assets/nature/statue_head.glb';
import n_lily_large from './assets/nature/lily_large.glb';
import n_lily_small from './assets/nature/lily_small.glb';
import n_fence_simple from './assets/nature/fence_simple.glb';
import n_tree_palmDetailedTall from './assets/nature/tree_palmDetailedTall.glb';
import n_tree_tall_fall from './assets/nature/tree_tall_fall.glb';
import n_tree_fat_fall from './assets/nature/tree_fat_fall.glb';
import n_tree_oak_fall from './assets/nature/tree_oak_fall.glb';
import n_tree_default_fall from './assets/nature/tree_default_fall.glb';
import n_tree_tall from './assets/nature/tree_tall.glb';
import n_tree_fat from './assets/nature/tree_fat.glb';
import n_platform_beach from './assets/nature/platform_beach.glb';
import n_sign from './assets/nature/sign.glb';
import n_mushroom_redTall from './assets/nature/mushroom_redTall.glb';
import n_plant_bushLargeTriangle from './assets/nature/plant_bushLargeTriangle.glb';
import n_rock_tallG from './assets/nature/rock_tallG.glb';
import n_path_stone from './assets/nature/path_stone.glb';
import n_tree_pineTallD from './assets/nature/tree_pineTallD.glb';

import k_race from './assets/cars/race.glb';
import k_future from './assets/cars/race-future.glb';
import k_viper from './assets/cars/sedan-sports.glb';
import k_hatch from './assets/cars/hatchback-sports.glb';
import k_taxi from './assets/cars/taxi.glb';
import k_police from './assets/cars/police.glb';
import k_luxe from './assets/cars/suv-luxury.glb';
import k_medic from './assets/cars/ambulance.glb';
import k_fire from './assets/cars/firetruck.glb';
import k_kart from './assets/cars/kart-oobi.glb';
import carTex from './assets/cars/colormap.png';
import k_wheel_default from './assets/cars/wheel-default.glb';
import k_wheel_dark from './assets/cars/wheel-dark.glb';
import k_cone from './assets/cars/cone.glb';
import k_box from './assets/cars/box.glb';


import gp_bannerTowerGreen from './assets/gp/bannerTowerGreen.glb';
import gp_bannerTowerRed from './assets/gp/bannerTowerRed.glb';
import gp_barrierRed from './assets/gp/barrierRed.glb';
import gp_barrierWhite from './assets/gp/barrierWhite.glb';
import gp_billboard from './assets/gp/billboard.glb';
import gp_billboardLow from './assets/gp/billboardLow.glb';
import gp_flagCheckers from './assets/gp/flagCheckers.glb';
import gp_flagGreen from './assets/gp/flagGreen.glb';
import gp_flagRed from './assets/gp/flagRed.glb';
import gp_grandStand from './assets/gp/grandStand.glb';
import gp_grandStandAwning from './assets/gp/grandStandAwning.glb';
import gp_grandStandCovered from './assets/gp/grandStandCovered.glb';
import gp_grandStandRound from './assets/gp/grandStandRound.glb';
import gp_lightPostLarge from './assets/gp/lightPostLarge.glb';
import gp_lightPostModern from './assets/gp/lightPostModern.glb';
import gp_overhead from './assets/gp/overhead.glb';
import gp_pitsGarage from './assets/gp/pitsGarage.glb';
import gp_pitsGarageClosed from './assets/gp/pitsGarageClosed.glb';
import gp_pitsOffice from './assets/gp/pitsOffice.glb';
import gp_pitsOfficeCorner from './assets/gp/pitsOfficeCorner.glb';
import gp_raceCarGreen from './assets/gp/raceCarGreen.glb';
import gp_raceCarOrange from './assets/gp/raceCarOrange.glb';
import gp_raceCarRed from './assets/gp/raceCarRed.glb';
import gp_raceCarWhite from './assets/gp/raceCarWhite.glb';
import gp_radarEquipment from './assets/gp/radarEquipment.glb';
import gp_roadCornerLargeBorder from './assets/gp/roadCornerLargeBorder.glb';
import gp_roadCornerLargerBorder from './assets/gp/roadCornerLargerBorder.glb';
import gp_roadCornerLarger from './assets/gp/roadCornerLarger.glb';
import gp_roadCornerSmall from './assets/gp/roadCornerSmall.glb';
import gp_roadCornerSmallBorder from './assets/gp/roadCornerSmallBorder.glb';
import gp_roadCornerLargerBorderInner from './assets/gp/roadCornerLargerBorderInner.glb';
import gp_roadRampLong from './assets/gp/roadRampLong.glb';
import gp_roadStart from './assets/gp/roadStart.glb';
import gp_roadStraight from './assets/gp/roadStraight.glb';
import gp_roadStraightBridgeMid from './assets/gp/roadStraightBridgeMid.glb';
import gp_roadStraightLong from './assets/gp/roadStraightLong.glb';
import gp_tent from './assets/gp/tent.glb';
import gp_tentClosed from './assets/gp/tentClosed.glb';
import gp_tentLong from './assets/gp/tentLong.glb';
import gp_treeLarge from './assets/gp/treeLarge.glb';
import gp_treeSmall from './assets/gp/treeSmall.glb';

/* ------------------------------------------------------------------ data */
const RIDES = [
  { id: 'ember', name: 'Ember Truck', kind: 'Truck', glb: gRed, color: '#ff8a3d', trait: 'The all-rounder. No weak spots, no tricks.', speed: 3, handling: 3, boost: 3 },
  { id: 'sun', name: 'Sun Truck', kind: 'Truck', glb: gYellow, color: '#f5c431', trait: 'Rockets down the straights, but a typo costs you more.', speed: 4, handling: 2, boost: 3 },
  { id: 'moss', name: 'Moss Truck', kind: 'Truck', glb: gGreen, color: '#4bc46d', trait: 'Grips well. Typos slow you down less.', speed: 2, handling: 4, boost: 3 },
  { id: 'plum', name: 'Plum Truck', kind: 'Truck', glb: gPurple, color: '#a98bff', trait: 'Your turbo meter charges faster while you type clean.', speed: 3, handling: 2, boost: 4 },
  { id: 'bolt', name: 'Bolt Bike', kind: 'Bike', glb: gBike, color: '#4bc46d', trait: 'Light and quick, but turbo charges slowly.', speed: 4, handling: 4, boost: 2 },
  { id: 'race', name: 'Redline Racer', kind: 'Racer', glb: k_race, tex: 'car', color: '#e8452c', trait: 'Pure speed. Wobbly in corners, so type steady.', speed: 5, handling: 2, boost: 2 },
  { id: 'future', name: 'Comet Future', kind: 'Racer', glb: k_future, tex: 'car', color: '#3d6bff', trait: 'Slippery-fast with a deep turbo tank.', speed: 4, handling: 2, boost: 4 },
  { id: 'viper', name: 'Viper Coupe', kind: 'Sports', glb: k_viper, tex: 'car', color: '#ff6a3d', trait: 'Quick off the line and sharp in the bends.', speed: 4, handling: 3, boost: 2 },
  { id: 'hatch', name: 'Pocket Hatch', kind: 'Sports', glb: k_hatch, tex: 'car', color: '#2fb36a', trait: 'Nimble. Forgives typos in tight corners.', speed: 2, handling: 5, boost: 3 },
  { id: 'taxi', name: 'Yellow Cab', kind: 'Sedan', glb: k_taxi, tex: 'car', color: '#f5c431', trait: 'Steady and reliable. Turbo fills up fast.', speed: 3, handling: 3, boost: 4 },
  { id: 'police', name: 'Patrol Cruiser', kind: 'Sedan', glb: k_police, tex: 'car', color: '#8fa3ff', trait: 'Balanced pursuit car with solid grip.', speed: 3, handling: 4, boost: 3 },
  { id: 'luxe', name: 'Luxe SUV', kind: 'SUV', glb: k_luxe, tex: 'car', color: '#c9ccd8', trait: 'Heavy but smooth. Loses little speed on typos.', speed: 3, handling: 3, boost: 3 },
  { id: 'medic', name: 'Medic Van', kind: 'Van', glb: k_medic, tex: 'car', color: '#ff5b5b', trait: 'Slow to start, but recovers from mistakes fast.', speed: 2, handling: 4, boost: 3 },
  { id: 'fire', name: 'Blaze Engine', kind: 'Truck', glb: k_fire, tex: 'car', color: '#e8452c', trait: 'A big red rocket with huge turbo.', speed: 3, handling: 2, boost: 5 },
  { id: 'wave', name: 'Wavebreaker', kind: 'Boat', glb: b_boat_speed_a, tex: 'boat', color: '#3aa0ff', trait: 'A sleek speedboat. Fast and responsive on the water.', speed: 4, handling: 3, boost: 3 },
  { id: 'jet', name: 'Jet Skimmer', kind: 'Boat', glb: b_boat_speed_d, tex: 'boat', color: '#ff6a3d', trait: 'Light and snappy. Turns on a coin.', speed: 3, handling: 5, boost: 2 },
  { id: 'marlin', name: 'Marlin Racer', kind: 'Boat', glb: b_boat_speed_f, tex: 'boat', color: '#2fd0c0', trait: 'Pure top speed, but wide in the turns.', speed: 5, handling: 2, boost: 3 },
  { id: 'comet', name: 'Comet Hull', kind: 'Boat', glb: b_boat_speed_h, tex: 'boat', color: '#a98bff', trait: 'Deep turbo tank for big finishing sprints.', speed: 3, handling: 3, boost: 5 },
  { id: 'storm', name: 'Storm Cutter', kind: 'Boat', glb: b_boat_speed_j, tex: 'boat', color: '#e8452c', trait: 'Long and fast. Forgives a few typos.', speed: 4, handling: 3, boost: 4 },
  { id: 'tug', name: 'Harbor Tug', kind: 'Boat', glb: b_boat_tug_a, tex: 'boat', color: '#f5c431', trait: 'Chunky and steady. Barely slows on mistakes.', speed: 2, handling: 4, boost: 4 },
  { id: 'sail', name: 'Gale Sail', kind: 'Boat', glb: b_boat_sail_a, tex: 'boat', color: '#f2f5ff', trait: 'Catches the wind. Great handling, modest turbo.', speed: 3, handling: 5, boost: 2 },
  { id: 'kart', name: 'Oobi Kart', kind: 'Kart', glb: k_kart, tex: 'car', color: '#ffb4ec', trait: 'Tiny and twitchy. Quick turn-in, light turbo.', speed: 3, handling: 5, boost: 2 }
];
const RIVALS = [
  { name: 'Mira', wpm: 50, color: '#d0583b', av: '\ud83e\udd8a', pref: ['race', 'viper', 'sun', 'ember', 'moss', 'plum', 'bolt'] },
  { name: 'Pip', wpm: 44, color: '#3f9a3b', av: '\ud83d\udc38', pref: ['bolt', 'kart', 'hatch', 'moss', 'plum', 'ember', 'sun'] },
  { name: 'Jonas', wpm: 38, color: '#2a9aa8', av: '\ud83d\udc19', pref: ['police', 'taxi', 'plum', 'sun', 'ember', 'moss', 'bolt'] }
];
const TILE = 10;
const COM_GLB = {m_building_a: m_building_a, m_building_b: m_building_b, m_building_d: m_building_d, m_building_f: m_building_f, m_building_g: m_building_g, m_building_h: m_building_h, m_building_i: m_building_i, m_building_l: m_building_l, m_building_m: m_building_m, m_building_skyscraper_a: m_building_skyscraper_a, m_building_skyscraper_c: m_building_skyscraper_c, m_building_skyscraper_d: m_building_skyscraper_d, m_building_skyscraper_e: m_building_skyscraper_e, m_low_detail_building_a: m_low_detail_building_a, m_low_detail_building_c: m_low_detail_building_c, m_low_detail_building_g: m_low_detail_building_g, m_low_detail_building_h: m_low_detail_building_h, m_low_detail_building_m: m_low_detail_building_m};
const IND_GLB = {i_building_a: i_building_a, i_building_b: i_building_b, i_building_c: i_building_c, i_building_d: i_building_d, i_building_e: i_building_e, i_building_f: i_building_f, i_building_g: i_building_g, i_building_l: i_building_l, i_building_m: i_building_m, i_building_q: i_building_q, i_building_r: i_building_r, i_building_t: i_building_t, i_water_tower: i_water_tower, i_chimney_large: i_chimney_large, i_detail_tank_large: i_detail_tank_large, i_shipping_container_a: i_shipping_container_a, i_shipping_container_b: i_shipping_container_b, i_shipping_container_c: i_shipping_container_c, i_solar_panel_landscape_group: i_solar_panel_landscape_group, i_windmill: i_windmill};
const CITY_GLB = {c_road_curve: c_road_curve, c_road_curve_barrier: c_road_curve_barrier, c_road_roundabout: c_road_roundabout, c_road_roundabout_barrier: c_road_roundabout_barrier, c_road_slant_flat_high: c_road_slant_flat_high, c_sign_highway: c_sign_highway, c_sign_highway_wide: c_sign_highway_wide, c_road_crossing: c_road_crossing, c_road_crossroad: c_road_crossroad, c_road_side: c_road_side, c_light_curved_double: c_light_curved_double, c_light_square_double: c_light_square_double, c_road_sign_street: c_road_sign_street, c_road_straight_half: c_road_straight_half, c_road_slant_high: c_road_slant_high, c_road_slant_high_barrier: c_road_slant_high_barrier, c_road_bridge: c_road_bridge, c_bridge_pillar: c_bridge_pillar, c_road_straight: c_road_straight, c_road_bend: c_road_bend, c_road_straight_barrier: c_road_straight_barrier, c_road_bend_barrier: c_road_bend_barrier, c_light_square: c_light_square, c_light_curved: c_light_curved, c_traffic_light: c_traffic_light, c_construction_cone: c_construction_cone, c_construction_barrier: c_construction_barrier, c_road_sign_warning: c_road_sign_warning, c_dumpster: c_dumpster};
const NATURE_GLB = {cactus_tall: n_cactus_tall, cactus_short: n_cactus_short, tree_palmTall: n_tree_palmTall, tree_palm: n_tree_palm, rock_largeA: n_rock_largeA, rock_largeC: n_rock_largeC, rock_tallA: n_rock_tallA, rock_tallC: n_rock_tallC, stone_largeA: n_stone_largeA, stone_tallB: n_stone_tallB, stone_smallA: n_stone_smallA, tree_pineTallA: n_tree_pineTallA, tree_pineTallC_detailed: n_tree_pineTallC_detailed, tree_pineDefaultA: n_tree_pineDefaultA, tree_pineSmallA: n_tree_pineSmallA, tree_pineRoundC: n_tree_pineRoundC, tree_oak: n_tree_oak, tree_default: n_tree_default, plant_bush: n_plant_bush, plant_bushLarge: n_plant_bushLarge, flower_redA: n_flower_redA, flower_yellowA: n_flower_yellowA, flower_purpleA: n_flower_purpleA, stump_old: n_stump_old, log_large: n_log_large, cliff_block_rock: n_cliff_block_rock, cliff_waterfall_rock: n_cliff_waterfall_rock, tent_detailedOpen: n_tent_detailedOpen, tent_smallOpen: n_tent_smallOpen, campfire_logs: n_campfire_logs, canoe: n_canoe, log_stack: n_log_stack, crops_dirtDoubleRow: n_crops_dirtDoubleRow, crop_pumpkin: n_crop_pumpkin, crop_melon: n_crop_melon, crops_cornStageD: n_crops_cornStageD, crops_wheatStageB: n_crops_wheatStageB, statue_obelisk: n_statue_obelisk, statue_ring: n_statue_ring, statue_head: n_statue_head, lily_large: n_lily_large, lily_small: n_lily_small, fence_simple: n_fence_simple, tree_palmDetailedTall: n_tree_palmDetailedTall, tree_tall_fall: n_tree_tall_fall, tree_fat_fall: n_tree_fat_fall, tree_oak_fall: n_tree_oak_fall, tree_default_fall: n_tree_default_fall, tree_tall: n_tree_tall, tree_fat: n_tree_fat, platform_beach: n_platform_beach, sign: n_sign, mushroom_redTall: n_mushroom_redTall, plant_bushLargeTriangle: n_plant_bushLargeTriangle, rock_tallG: n_rock_tallG, path_stone: n_path_stone, tree_pineTallD: n_tree_pineTallD};
const GP_GLB = {gp_roadCornerLarger: gp_roadCornerLarger, gp_roadCornerSmall: gp_roadCornerSmall, gp_roadCornerSmallBorder: gp_roadCornerSmallBorder, gp_roadCornerLargerBorderInner: gp_roadCornerLargerBorderInner, gp_bannerTowerGreen: gp_bannerTowerGreen, gp_bannerTowerRed: gp_bannerTowerRed, gp_barrierRed: gp_barrierRed, gp_barrierWhite: gp_barrierWhite, gp_billboard: gp_billboard, gp_billboardLow: gp_billboardLow, gp_flagCheckers: gp_flagCheckers, gp_flagGreen: gp_flagGreen, gp_flagRed: gp_flagRed, gp_grandStand: gp_grandStand, gp_grandStandAwning: gp_grandStandAwning, gp_grandStandCovered: gp_grandStandCovered, gp_grandStandRound: gp_grandStandRound, gp_lightPostLarge: gp_lightPostLarge, gp_lightPostModern: gp_lightPostModern, gp_overhead: gp_overhead, gp_pitsGarage: gp_pitsGarage, gp_pitsGarageClosed: gp_pitsGarageClosed, gp_pitsOffice: gp_pitsOffice, gp_pitsOfficeCorner: gp_pitsOfficeCorner, gp_raceCarGreen: gp_raceCarGreen, gp_raceCarOrange: gp_raceCarOrange, gp_raceCarRed: gp_raceCarRed, gp_raceCarWhite: gp_raceCarWhite, gp_radarEquipment: gp_radarEquipment, gp_roadCornerLargeBorder: gp_roadCornerLargeBorder, gp_roadCornerLargerBorder: gp_roadCornerLargerBorder, gp_roadRampLong: gp_roadRampLong, gp_roadStart: gp_roadStart, gp_roadStraight: gp_roadStraight, gp_roadStraightBridgeMid: gp_roadStraightBridgeMid, gp_roadStraightLong: gp_roadStraightLong, gp_tent: gp_tent, gp_tentClosed: gp_tentClosed, gp_tentLong: gp_tentLong, gp_treeLarge: gp_treeLarge, gp_treeSmall: gp_treeSmall};
const SPACE_GLB = {s_terrain_roadStraight: s_terrain_roadStraight, s_terrain_roadCorner: s_terrain_roadCorner, s_terrain: s_terrain, s_terrain_side: s_terrain_side, s_terrain_ramp: s_terrain_ramp, s_monorail_trainFront: s_monorail_trainFront, s_monorail_trainPassenger: s_monorail_trainPassenger, s_monorail_trainEnd: s_monorail_trainEnd, s_pipe_straight: s_pipe_straight, s_pipe_end: s_pipe_end, s_pipe_ring: s_pipe_ring, s_pipe_supportLow: s_pipe_supportLow, s_craft_speederC: s_craft_speederC, s_astronautB: s_astronautB, s_rocket_fuelB: s_rocket_fuelB, s_rocket_baseB: s_rocket_baseB, s_pipe_cornerRound: s_pipe_cornerRound, s_platform_straight: s_platform_straight, s_platform_cornerRound: s_platform_cornerRound, s_hangar_largeA: s_hangar_largeA, s_hangar_largeB: s_hangar_largeB, s_hangar_roundA: s_hangar_roundA, s_hangar_smallA: s_hangar_smallA, s_hangar_smallB: s_hangar_smallB, s_satelliteDish_large: s_satelliteDish_large, s_satelliteDish: s_satelliteDish, s_rocket_baseA: s_rocket_baseA, s_rocket_sidesA: s_rocket_sidesA, s_rocket_topA: s_rocket_topA, s_rocket_finsA: s_rocket_finsA, s_rocket_fuelA: s_rocket_fuelA, s_rock_crystalsLargeA: s_rock_crystalsLargeA, s_rock_crystalsLargeB: s_rock_crystalsLargeB, s_rock_largeA: s_rock_largeA, s_rock_largeB: s_rock_largeB, s_rocks_smallA: s_rocks_smallA, s_rocks_smallB: s_rocks_smallB, s_crater: s_crater, s_craterLarge: s_craterLarge, s_meteor: s_meteor, s_meteor_half: s_meteor_half, s_gate_complex: s_gate_complex, s_machine_generatorLarge: s_machine_generatorLarge, s_machine_wireless: s_machine_wireless, s_structure_detailed: s_structure_detailed, s_turret_double: s_turret_double, s_supports_low: s_supports_low, s_rover: s_rover, s_astronautA: s_astronautA, s_barrels: s_barrels, s_craft_speederA: s_craft_speederA, s_craft_cargoA: s_craft_cargoA, s_monorail_trackStraight: s_monorail_trackStraight, s_monorail_trackSupport: s_monorail_trackSupport};
const HEXBOAT_GLB = {nr_grass: nr_grass, nr_riverStraight: nr_riverStraight, nr_riverBend: nr_riverBend, nr_riverTile: nr_riverTile, nr_riverRocks: nr_riverRocks, b_boat_speed_a: b_boat_speed_a, b_boat_speed_d: b_boat_speed_d, b_boat_speed_f: b_boat_speed_f, b_boat_speed_h: b_boat_speed_h, b_boat_speed_j: b_boat_speed_j, b_boat_tug_a: b_boat_tug_a, b_boat_sail_a: b_boat_sail_a, b_buoy: b_buoy, b_buoy_flag: b_buoy_flag, b_gate_finish: b_gate_finish, b_ship_small: b_ship_small, b_boat_house_a: b_boat_house_a, b_boat_fishing_small: b_boat_fishing_small};
const PROP_GLB = { k_wheel_default, k_wheel_dark, k_cone, k_box };
const MAPS = [
  { id: 'forest', name: 'Neon Loop', biome: 'forest', laps: 3, weather: 'clear', verts: [[0, 4], [6, 4], [6, 0], [0, 0]], blurb: 'Fast and flowing' },
  { id: 'desert', name: 'Dune Run', biome: 'desert', laps: 3, weather: 'clear', verts: [[0, 0], [4, 0], [4, 2], [7, 2], [7, 5], [3, 5], [3, 3], [0, 3]], blurb: 'Eight tight corners' },
  { id: 'city', name: 'Downtown Dash', biome: 'city', laps: 2, weather: 'clear', verts: [[0, 0], [5, 0], [5, 2], [2, 2], [2, 4], [7, 4], [7, 7], [0, 7]], blurb: 'Street circuit' },
  { id: 'skyway', name: 'Skyway Circuit', biome: 'city', kind: 'c2', laps: 2, weather: 'clear', verts: [[0, 4], [8, 4], [8, 8], [4, 8], [4, 0], [0, 0]], blurb: 'Flyover crossing' },
  { id: 'rust', name: 'Mars Outpost', biome: 'city', style: 'space', laps: 2, weather: 'clear', verts: [[0, 0], [7, 0], [7, 3], [4, 3], [4, 5], [0, 5]], blurb: 'Red planet base' },
  { id: 'gp', name: 'Grand Prix', biome: 'forest', kind: 'gp', laps: 2, weather: 'clear', verts: [[-9, 0], [10, 0], [10, 9], [0, 9], [0, -9], [-9, -9]], blurb: 'Flyover figure-8' },
  { id: 'snow', name: 'Frostbite Ridge', biome: 'snow', laps: 2, weather: 'snow', verts: [[0, 0], [3, 0], [3, 2], [6, 2], [6, 0], [8, 0], [8, 4], [5, 4], [5, 6], [0, 6]], blurb: 'Long and twisty' },
  { id: 'bay', name: 'Harbor Run', biome: 'forest', style: 'river', cell: 2.8, laps: 2, weather: 'clear', verts: [[0, 0], [3, 0], [3, 1], [5, 1], [5, 4], [2, 4], [2, 3], [0, 3]], blurb: 'Winding canal' },
];
const WEATHERS = [
  { id: 'clear', name: 'Clear' }, { id: 'rain', name: 'Rain' }, { id: 'snow', name: 'Snow' }, { id: 'sand', name: 'Sandstorm' }, { id: 'fog', name: 'Fog' }
];
const BIOMES = {
  forest: { sky: ['#3b8fe0', '#8fd0ff', '#eaf6ff'], fog: '#d4ecff', n: 55, f: 200, hemiG: '#7a9a5a', ground: '#6fae4a' },
  desert: { sky: ['#2f86d6', '#a2d6f4', '#f4e2bd'], fog: '#f1dcb2', n: 55, f: 210, hemiG: '#c79a62', ground: '#d9b878' },
  snow: { sky: ['#5aa2e0', '#b5d8f2', '#f2f7fb'], fog: '#e9f1f8', n: 45, f: 190, hemiG: '#b8c6d8', ground: '#eaf1f8' },
  space: { sky: ['#2a1a2e', '#9a4a3a', '#e8a070'], fog: '#b8644a', n: 60, f: 260, hemiG: '#8a4a38', ground: '#b5532f' },
  river: { sky: ['#3f9be0', '#8fd0f2', '#d9f3fa'], fog: '#b4e4ee', n: 140, f: 520, hemiG: '#5fa080', ground: '#62cdf0' },
  city: { sky: ['#4f86d0', '#a4c6ee', '#e6eef8'], fog: '#d9e3ef', n: 60, f: 230, hemiG: '#8d93a6', ground: '#868b9a' }
};
const WEATHER_FX = {
  clear: null,
  rain: { sky: ['#43536a', '#6a7b90', '#95a4b5'], fog: '#95a4b5', n: 22, f: 120, sun: 0.8, hemi: 0.85 },
  snow: { sky: ['#8aa0b6', '#b7c7d6', '#dbe5ee'], fog: '#dbe5ee', n: 22, f: 130, sun: 1.2, hemi: 1.0 },
  sand: { sky: ['#b58650', '#d0a46a', '#dcb882'], fog: '#d6ad74', n: 6, f: 70, sun: 1.3, hemi: 1.0 },
  fog: { sky: ['#9aa7b3', '#b4bfc9', '#cdd5dc'], fog: '#c4ccd4', n: 4, f: 62, sun: 1.1, hemi: 1.0 }
};
let MAP = MAPS[0], WX = 'clear', LAPS = MAP.laps;
const IMPULSE = 1.5, FRICTION = 0.55, VMAX = 30; // IMPULSE / FRICTION sets top speed; lower friction = the car coasts instead of stopping dead
const EASY = ('road fast turn speed drive engine brake shift gear track lane pedal wheel smoke dust grip drift apex curb flag lap pit crew steer clutch nitro rocket thunder silver orange purple forest valley bridge tunnel canyon summit harbor meadow lantern marble copper velvet jungle anchor breeze cobalt dagger ember falcon glider harvest island jigsaw kettle lemon magnet nectar oyster pepper quartz ribbon saddle timber umbrella voyage willow yonder zephyr basket candle desert engineer feather garden hammer insect jacket kitchen ladder mirror needle orchard pillow quiver rabbit shadow tablet unicorn violin whistle').split(' ');
const CONTRACTIONS = ["don't", "can't", "won't", "isn't", "it's", "let's"];

/* ------------------------------------------------------------------ helpers */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function mulberry(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const fmtTime = (t) => { const m = Math.floor(t / 60); const s = t - m * 60; return String(m).padStart(2, '0') + ':' + s.toFixed(1).padStart(4, '0'); };
const ordinal = (n) => ['1ST', '2ND', '3RD', '4TH'][n - 1] || n + 'TH';

/* ------------------------------------------------------------------ renderer */
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const manager = new THREE.LoadingManager();
let texUrl = colormapUrl;
manager.setURLModifier((u) => { if (u.indexOf('colormap') >= 0) return texUrl; const b = u.split('/').pop(); return u; });
function parseGlb(u8) {
  const ab = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
  return new Promise((res, rej) => {
    const loader = new GLTFLoader(manager);
    const cib = window.createImageBitmap;
    try { window.createImageBitmap = undefined; loader.parse(ab, '', res, rej); } finally { window.createImageBitmap = cib; }
  });
}

/* ------------------------------------------------------------------ track */
// A track is a closed loop of grid cells. Corner tiles are rotated from the direction in and out.
// Kenney corner tile at rotation 0 opens to -x and +z; each quarter turn about Y moves the openings on.
const EDGE_PAIRS = [[[-1, 0], [0, 1]], [[0, 1], [1, 0]], [[1, 0], [0, -1]], [[0, -1], [-1, 0]]];
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
function cornerRot(d, d2) {
  const a = [-d[0], -d[1]];
  for (let k = 0; k < 4; k++) { const [p, q] = EDGE_PAIRS[k]; if ((same(a, p) && same(d2, q)) || (same(a, q) && same(d2, p))) return k; }
  return 0;
}
let CELLS = [];
const PTS = [], CUM = [], SEGS = [], TAN = [];
let TRACK_LEN = 0;
const BOUNDS = { minI: 0, maxI: 0, minJ: 0, maxJ: 0 };
let CELLF = 1;
const cellCenter = (c) => [(c.i - (BOUNDS.minI + BOUNDS.maxI) / 2) * TILE * CELLF, (c.j - (BOUNDS.minJ + BOUNDS.maxJ) / 2) * TILE * CELLF];
function buildTrack(map) {
  CELLF = map.cell || 1;
  if (map.kind === 'gp') { buildTrackGP(map); return; }
  if (map.kind === 'c2') { buildTrackC2(map); return; }
  START_OFFSET = 5 * CELLF;
  const pos = [];
  const vs = map.verts;
  BOUNDS.minI = Math.min(...vs.map((v) => v[0])); BOUNDS.maxI = Math.max(...vs.map((v) => v[0]));
  BOUNDS.minJ = Math.min(...vs.map((v) => v[1])); BOUNDS.maxJ = Math.max(...vs.map((v) => v[1]));
  for (let a = 0; a < vs.length; a++) {
    const [x0, y0] = vs[a], [x1, y1] = vs[(a + 1) % vs.length];
    const dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0), n = Math.abs(x1 - x0) + Math.abs(y1 - y0);
    for (let s = 0; s < n; s++) pos.push([x0 + dx * s, y0 + dy * s]);
  }
  const N = pos.length;
  const cells = pos.map((p, n) => {
    const pr = pos[(n - 1 + N) % N], nx = pos[(n + 1) % N];
    const d = [p[0] - pr[0], p[1] - pr[1]], d2 = [nx[0] - p[0], nx[1] - p[1]];
    const corner = !same(d, d2);
    return { i: p[0], j: p[1], d, d2, corner, k: corner ? cornerRot(d, d2) : 0 };
  });
  // flyovers: a cell visited twice is a crossing, the visit along z goes over the top
  const gy = map.biome === 'city' ? 0.2 : 0, hy = map.biome === 'city' ? 5.2 : 5.1, my = (gy + hy) / 2;
  cells.forEach((c) => { c.y0 = gy; c.y1 = gy; });
  const seen = {};
  cells.forEach((c, n) => { const k = c.i + ',' + c.j; (seen[k] = seen[k] || []).push(n); });
  for (const idxs of Object.values(seen)) {
    if (idxs.length !== 2) continue;
    const [a, b] = idxs; const e = cells[a].d[1] !== 0 ? a : b, g = e === a ? b : a;
    cells[e].cross = true; cells[e].elev = true; cells[g].cross = true;
    cells[e].y0 = cells[e].y1 = hy;
    const at = (o) => cells[(e + o + N * 4) % N];
    at(-2).ramp = 'up'; at(-2).rIdx = 0; at(-2).y1 = my; at(-1).ramp = 'up'; at(-1).rIdx = 1; at(-1).y0 = my; at(-1).y1 = hy;
    at(1).ramp = 'down'; at(1).rIdx = 0; at(1).y0 = hy; at(1).y1 = my; at(2).ramp = 'down'; at(2).rIdx = 1; at(2).y0 = my;
  }
  // start in the middle of the longest plain straight
  const plain = (c) => !c.corner && !c.ramp && !c.cross;
  let bestLen = 0, bestMid = 0;
  for (let s = 0; s < N; s++) {
    if (!plain(cells[s]) || plain(cells[(s - 1 + N) % N])) continue;
    let n = 0; while (plain(cells[(s + n) % N])) n++;
    if (n > bestLen) { bestLen = n; bestMid = (s + Math.floor(n / 2)) % N; }
  }
  CELLS = cells.slice(bestMid).concat(cells.slice(0, bestMid));
  PTS.length = 0; CUM.length = 0; SEGS.length = 0;
  const add = (x, z, y) => { const l = PTS[PTS.length - 1]; if (!l || Math.hypot(l.x - x, l.z - z) > 1e-4) PTS.push({ x, z, y: y || 0 }); };
  for (const c of CELLS) {
    const [cx, cz] = cellCenter(c);
    c.p0 = PTS.length;
    const H5 = 5 * CELLF;
    const ex = cx - c.d[0] * H5, ez = cz - c.d[1] * H5;
    const xx = cx + c.d2[0] * H5, xz = cz + c.d2[1] * H5;
    if (!c.corner) { add(ex, ez, c.y0); add(xx, xz, c.y1); }
    else {
      const ax = cx + (-c.d[0] + c.d2[0]) * H5, az = cz + (-c.d[1] + c.d2[1]) * H5;
      const a0 = Math.atan2(ez - az, ex - ax);
      let da = Math.atan2(xz - az, xx - ax) - a0;
      while (da > Math.PI) da -= 2 * Math.PI;
      while (da < -Math.PI) da += 2 * Math.PI;
      for (let s = 0; s <= 28; s++) { const a = a0 + (da * s) / 28; add(ax + H5 * Math.cos(a), az + H5 * Math.sin(a), c.y0); }
    }
    c.p1 = PTS.length - 1;
  }
  CUM.push(0);
  for (let n = 1; n < PTS.length; n++) CUM.push(CUM[n - 1] + Math.hypot(PTS[n].x - PTS[n - 1].x, PTS[n].z - PTS[n - 1].z));
  TRACK_LEN = CUM[CUM.length - 1];
  TAN.length = 0;
  for (let n = 0; n < PTS.length; n++) {
    const p = PTS[(n - 1 + PTS.length) % PTS.length], q = PTS[(n + 1) % PTS.length];
    const dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; TAN.push({ x: dx / l, z: dz / l });
  }
  for (const c of CELLS) SEGS.push({ a: CUM[c.p0], b: CUM[c.p1], corner: c.corner });
  MAP = map; LAPS = map.laps;
}
buildTrack(MAP);
let START_OFFSET = 5; // finish line sits at the centre of the first cell
const _p = { x: 0, z: 0, y: 0, tx: 0, tz: 1, pitch: 0 };
function pointAt(sGame) {
  let s = (sGame + START_OFFSET) % TRACK_LEN; if (s < 0) s += TRACK_LEN;
  let lo = 0, hi = CUM.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (CUM[m] <= s) lo = m; else hi = m; }
  const a = PTS[lo], b = PTS[lo + 1];
  const dx = b.x - a.x, dz = b.z - a.z, len = Math.hypot(dx, dz) || 1;
  const f = (s - CUM[lo]) / (CUM[lo + 1] - CUM[lo] || 1);
  _p.x = a.x + dx * f; _p.z = a.z + dz * f; _p.y = a.y + (b.y - a.y) * f; const t0 = TAN[lo], t1 = TAN[lo + 1]; let ux = t0.x + (t1.x - t0.x) * f, uz = t0.z + (t1.z - t0.z) * f; const ul = Math.hypot(ux, uz) || 1; _p.tx = ux / ul; _p.tz = uz / ul; _p.pitch = Math.atan2(b.y - a.y, len);
  return _p;
}
function cornerAt(sGame) {
  let s = (sGame + START_OFFSET) % TRACK_LEN; if (s < 0) s += TRACK_LEN;
  for (const g of SEGS) if (s >= g.a && s <= g.b) return g.corner;
  return false;
}


/* ------------------------------------------------------------------ Grand Prix circuit (full Kenney Racing Kit) */
const GP_SC = 10, GP_TOP = 5.2, GP_Y0 = 0.2;
const GP_DIR = [[1, 0], [0, 1], [-1, 0], [0, -1]];
let GP = null;
function gpProgram() {
  // a figure-8: lap starts on the pit straight, loops round the south-east lobe, goes over the flyover and round the north-west lobe, then under the flyover
  return [
    { t: 'start' }, { t: 'S', n: 2 }, { t: 'C', turn: 'R' }, { t: 'S', n: 4 }, { t: 'C', turn: 'R' }, { t: 'S', n: 5 }, { t: 'C', turn: 'R' }, { t: 'S', n: 4 },
    { t: 'ramp', up: true }, { t: 'deck' }, { t: 'ramp', up: false },
    { t: 'S', n: 4 }, { t: 'C', turn: 'L' }, { t: 'S', n: 4 }, { t: 'C', turn: 'L' }, { t: 'S', n: 4 }, { t: 'C', turn: 'L' },
    { t: 'S', n: 6 }, { t: 'S', n: 1 }, { t: 'S', n: 3 }
  ];
}
function buildTrackGP(map) {
  const N = 3, R = N - 0.5;
  let x = 3.5, z = 0, d = 0, y = GP_Y0;
  const pieces = [], pts = [{ x, z, y }], segs = [];
  const line = (name, L, y1, flag) => {
    const dv = GP_DIR[d], rev = name === 'roadRampLong' && y1 < y;
    const i0 = pts.length - 1;
    pieces.push({ name, x, z, d, L, rev });
    x += dv[0] * L; z += dv[1] * L; y = y1; pts.push({ x, z, y });
    segs.push({ i0, i1: pts.length - 1, corner: false });
  };
  for (const st of gpProgram()) {
    if (st.t === 'start') line('roadStart', 2, y);
    else if (st.t === 'S') { let n = st.n; while (n >= 2) { line('roadStraightLong', 2, y); n -= 2; } if (n === 1) line('roadStraight', 1, y); }
    else if (st.t === 'ramp') line('roadRampLong', 2, st.up ? GP_TOP : GP_Y0);
    else if (st.t === 'deck') line('roadStraightBridgeMid', 1, y);
    else if (st.t === 'C') {
      const right = st.turn === 'R', nd = (d + (right ? 1 : 3)) % 4, dv = GP_DIR[d], sv = GP_DIR[nd];
      const cx = x + sv[0] * R, cz = z + sv[1] * R, ex = cx + dv[0] * R, ez = cz + dv[1] * R;
      const i0 = pts.length - 1;
      for (const nm of ['roadCornerLarger', 'roadCornerLargerBorder', 'roadCornerLargerBorderInner']) pieces.push({ name: nm, x, z, d, N, rev: !right, corner: true });
      const a0 = Math.atan2(z - cz, x - cx); let da = Math.atan2(ez - cz, ex - cx) - a0;
      while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      for (let k = 1; k <= 40; k++) { const a = a0 + da * k / 40; pts.push({ x: cx + R * Math.cos(a), z: cz + R * Math.sin(a), y }); }
      x = ex; z = ez; d = nd;
      segs.push({ i0, i1: pts.length - 1, corner: true });
    }
  }
  const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
  const cx0 = (Math.min(...xs) + Math.max(...xs)) / 2, cz0 = (Math.min(...zs) + Math.max(...zs)) / 2;
  PTS.length = 0; CUM.length = 0; SEGS.length = 0; TAN.length = 0; CELLS = [];
  for (const p of pts) { const q = { x: (p.x - cx0) * GP_SC, z: (p.z - cz0) * GP_SC, y: p.y }; const l = PTS[PTS.length - 1]; if (!l || Math.hypot(l.x - q.x, l.z - q.z) > 1e-4) PTS.push(q); else l.y = Math.max(l.y, q.y); }
  // keep indices for segments after de-duplication (points are only dropped when identical, so match by position)
  CUM.push(0);
  for (let n = 1; n < PTS.length; n++) CUM.push(CUM[n - 1] + Math.hypot(PTS[n].x - PTS[n - 1].x, PTS[n].z - PTS[n - 1].z));
  TRACK_LEN = CUM[CUM.length - 1];
  for (let n = 0; n < PTS.length; n++) {
    const p = PTS[(n - 1 + PTS.length) % PTS.length], q = PTS[(n + 1) % PTS.length];
    const dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; TAN.push({ x: dx / l, z: dz / l });
  }
  const find = (p) => { const qx = (p.x - cx0) * GP_SC, qz = (p.z - cz0) * GP_SC; let b = 0, bd = 1e9; for (let n = 0; n < PTS.length; n++) { const dd = Math.hypot(PTS[n].x - qx, PTS[n].z - qz); if (dd < bd) { bd = dd; b = n; } } return b; };
  for (const sg of segs) SEGS.push({ a: CUM[find(pts[sg.i0])], b: CUM[find(pts[sg.i1])], corner: sg.corner });
  GP = { pieces, cx: cx0, cz: cz0 };
  START_OFFSET = 10; MAP = map; LAPS = map.laps;
}
const gpW = (tx, tz) => [(tx - GP.cx) * GP_SC, (tz - GP.cz) * GP_SC];
function gpRotFor(hx, hz, d) {
  for (let k = 0; k < 4; k++) { const th = k * Math.PI / 2, c = Math.round(Math.cos(th)), s = Math.round(Math.sin(th)); if (hx * c + hz * s === d[0] && -hx * s + hz * c === d[1]) return th; }
  return 0;
}
function gpMat(wx, wz, th, sc, ax, az, y) {
  const M = new THREE.Matrix4().makeTranslation(wx, y || 0, wz);
  M.multiply(new THREE.Matrix4().makeRotationY(th)); M.multiply(new THREE.Matrix4().makeScale(sc, sc, sc));
  M.multiply(new THREE.Matrix4().makeTranslation(-ax, 0, -az)); return M;
}
function gpDistToPath(x, z) {
  let best = 1e9;
  for (let n = 0; n + 1 < PTS.length; n++) {
    const a = PTS[n], b = PTS[n + 1], dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz || 1;
    const t = clamp(((x - a.x) * dx + (z - a.z) * dz) / l2, 0, 1); best = Math.min(best, Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t)));
  }
  return best;
}
function buildGP(group) {
  const B = {}; const put = (name, M) => { (B[name] = B[name] || []).push(M); };
  const taken = [];
  for (const pc of GP.pieces) {
    const [wx, wz] = gpW(pc.x, pc.z), dv = GP_DIR[pc.d];
    let ax, az, hx, hz;
    if (pc.corner) { if (!pc.rev) { ax = 0.5; az = 0; hx = 0; hz = -1; } else { ax = pc.N; az = -(pc.N - 0.5); hx = -1; hz = 0; } }
    else if (!pc.rev) { ax = 0.5; az = 0; hx = 0; hz = -1; } else { ax = 0.5; az = -pc.L; hx = 0; hz = 1; }
    const Mp = gpMat(wx, wz, gpRotFor(hx, hz, dv), GP_SC, ax, az, 0);
    if (pc.name === 'roadStart') { // the start piece road sits 0.13 tile off its origin (gantry overhangs), so centre it on the path
      const Q = new THREE.Matrix4().makeTranslation(wx, 0, wz).multiply(new THREE.Matrix4().makeRotationY(gpRotFor(hx, hz, dv)))
        .multiply(new THREE.Matrix4().makeScale(GP_SC, GP_SC, GP_SC)).multiply(new THREE.Matrix4().makeTranslation(-0.63, 0, -az)); put(pc.name, Q);
    } else put(pc.name, Mp);
  }
  // decor helpers: footprint (w x d) is [0,w] x [-d,0] with the front facing +z
  const decor = (name, wx, wz, f, sc, w, dd, y) => { put(name, gpMat(wx, wz, Math.atan2(f[0], f[1]), sc, w / 2, -dd / 2, y || 0)); taken.push({ x: wx, z: wz, r: 0.55 * sc * Math.max(w, dd) }); };
  const frame = (s) => { const p = pointAt(s); return { x: p.x, z: p.z, tx: p.tx, tz: p.tz, nx: -p.tz, nz: p.tx }; };
  // pit lane buildings on the left of the start straight, grandstands facing them on the right
  for (let k = -3; k <= 3; k++) {
    const f = frame(k * 10.5);
    const nm = k === 0 ? 'pitsOffice' : (Math.abs(k) % 2 ? 'pitsGarage' : 'pitsGarageClosed');
    decor(nm, f.x - f.nx * 15.5, f.z - f.nz * 15.5, [f.nx, f.nz], 10, 1, 1);
  }
  for (let k = -3; k <= 3; k++) {
    const f = frame(k * 10.5 + 5);
    decor(Math.abs(k) === 1 ? 'grandStandCovered' : 'grandStand', f.x + f.nx * 16, f.z + f.nz * 16, [-f.nx, -f.nz], 10, 1, 1);
  }
  // start gantry
  { const f = frame(0); put('overhead', gpMat(f.x, f.z, Math.atan2(-f.nz, f.nx), 10, 0.5, 0.1, 0));
    for (const sd of [-1, 1]) decor(sd < 0 ? 'bannerTowerRed' : 'bannerTowerGreen', f.x + f.nx * sd * 9.5, f.z + f.nz * sd * 9.5, [-f.nx * sd, -f.nz * sd], 8, 1, 1); }
  // paddock tents and billboards inside the south-east lobe
  const interior = [[3.2, 4.2, 'tentLong'], [5.6, 4.2, 'tent'], [7.0, 4.2, 'tentClosed'], [3.2, 6.2, 'tent'], [5.2, 6.4, 'tentLong']];
  for (const [tx, tz, nm] of interior) { const [wx, wz] = gpW(tx, tz); decor(nm, wx, wz, [0, 1], 10, nm === 'tentLong' ? 2 : 1, 1); }
  for (const [tx, tz, fx, fz] of [[3.0, 2.2, 0, -1], [6.4, 2.4, 0, -1], [11.6, 4.5, -1, 0], [-11.2, -4.5, 1, 0]]) { const [wx, wz] = gpW(tx, tz); decor('billboard', wx, wz, [fx, fz], 7, 1, 1); }
  for (const [tx, tz, fx, fz] of [[12.4, 3.2, -1, 0], [-11.8, -6.2, 1, 0]]) { const [wx, wz] = gpW(tx, tz); decor('grandStandRound', wx, wz, [fx, fz], 10, 1.64, 1.64); }
  // light posts along the straights
  for (let s = 20; s < TRACK_LEN - 20; s += 38) {
    const f = frame(s), g = frame(s + 6); if (Math.abs(f.tx * g.tz - f.tz * g.tx) > 0.02) continue;
    const sd = (Math.floor(s / 38) % 2) ? 1 : -1;
    const px = f.x + f.nx * sd * 8.4, pz = f.z + f.nz * sd * 8.4;
    if (taken.some((t) => Math.hypot(t.x - px, t.z - pz) < t.r + 2)) continue;
    decor('lightPostLarge', px, pz, [-f.nx * sd, -f.nz * sd], 6.5, 0.38, 0.1);
  }
  // trees
  const rnd = mulberry(77), xs = PTS.map((p) => p.x), zs = PTS.map((p) => p.z), m = 75;
  const x0 = Math.min(...xs) - m, x1 = Math.max(...xs) + m, z0 = Math.min(...zs) - m, z1 = Math.max(...zs) + m;
  let placed = 0;
  for (let tries = 0; tries < 2600 && placed < 260; tries++) {
    const px = x0 + rnd() * (x1 - x0), pz = z0 + rnd() * (z1 - z0);
    if (gpDistToPath(px, pz) < 13 || taken.some((t) => Math.hypot(t.x - px, t.z - pz) < t.r + 4)) continue;
    const big = rnd() < 0.6, sc = (big ? 7 : 8) * (0.8 + rnd() * 0.5);
    put(big ? 'treeLarge' : 'treeSmall', gpMat(px, pz, rnd() * 6.28, sc, 0, 0, 0)); placed++;
  }
  for (const nm of Object.keys(B)) {
    const model = models['gp_' + nm]; if (!model) continue;
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}

/* ------------------------------------------------------------------ assets + scenes */
const raceScene = new THREE.Scene();
const garageScene = new THREE.Scene();
const models = {};
const garageModels = {};
const raceCamera = new THREE.PerspectiveCamera(62, 16 / 9, 0.1, 400);
const garageCamera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100);

function skyTexture(cols) {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512;
  const cx = cv.getContext('2d'); const gr = cx.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, cols[0]); gr.addColorStop(0.55, cols[1]); gr.addColorStop(1, cols[2]);
  cx.fillStyle = gr; cx.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* recolour the shared colormap so the same tiles read as sand or snow */
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
  }
  return [h, s, l];
}
function hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
}
const envTex = {}, envMats = new Map();
function biomeTexture(biome, orig) {
  if (envTex[biome]) return envTex[biome];
  const img = orig.image; const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
  const data = cx.getImageData(0, 0, cv.width, cv.height); const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const [h, s, l] = rgb2hsl(px[i], px[i + 1], px[i + 2]);
    if (h < 95 || h > 185 || s < 0.2) continue; // only the greens
    let out;
    if (biome === 'desert') out = hsl2rgb(37, 0.55, 0.52 + (l - 0.4) * 0.6);
    else if (l < 0.46) out = hsl2rgb(212, 0.3, 0.92 + (l - 0.4) * 0.1); // ground becomes snow
    else out = hsl2rgb(188, 0.28, 0.27 + (l - 0.5) * 0.45); // frosted pine
    px[i] = out[0]; px[i + 1] = out[1]; px[i + 2] = out[2];
  }
  cx.putImageData(data, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.flipY = orig.flipY; t.colorSpace = orig.colorSpace; t.wrapS = orig.wrapS; t.wrapT = orig.wrapT; t.magFilter = orig.magFilter; t.minFilter = orig.minFilter; t.anisotropy = orig.anisotropy; envTex[biome] = t; return t;
}
function envMat(mat, biome) {
  if (biome === 'forest' || biome === 'city' || !mat.map) return mat;
  const key = mat.uuid + biome;
  if (!envMats.has(key)) { const m = mat.clone(); m.map = biomeTexture(biome, mat.map); envMats.set(key, m); }
  return envMats.get(key);
}

function mergePlacements(template, placements, biome) {
  const meshes = [];
  template.updateWorldMatrix(true, true);
  template.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const out = new THREE.Group();
  for (const m of meshes) {
    const geos = placements.map((p) => {
      const g = m.geometry.clone();
      const M = new THREE.Matrix4().makeRotationY(p.rot); if (p.s) M.scale(new THREE.Vector3(p.s, p.s, p.s)); M.setPosition(p.x, p.y || 0, p.z); M.multiply(m.matrixWorld);
      g.applyMatrix4(M); return g;
    });
    const merged = mergeGeometries(geos, false);
    const mesh = new THREE.Mesh(merged, envMat(m.material, biome));
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
    out.add(mesh);
  }
  return out;
}

/* Kenney Nature Kit pieces, recoloured per biome */
const NAT_COL = {
  leafsGreen: { forest: '#4aa84f', desert: '#52a04c', snow: '#eef5fa' },
  leafsDark: { forest: '#2c8a5a', desert: '#3f8a50', snow: '#d4e3ee' },
  woodBark: { all: '#8a5a3a' }, woodBarkDark: { all: '#6e4630' }, woodInner: { all: '#e8d2b0' },
  grass: { forest: '#6fbf55', desert: '#d8b676', snow: '#f6fafd' },
  dirt: { forest: '#a8774f', desert: '#c4925f', snow: '#9aa7b6' },
  stone: { forest: '#a7b0bb', desert: '#c9a57c', snow: '#b8c6d6' },
  _defaultMat: { all: '#9aa3ad' }
};
const natMats = new Map();
function natMat(orig, biome) {
  const key = orig.name + biome;
  if (!natMats.has(key)) {
    const e = NAT_COL[orig.name]; let col;
    if (e) col = e[biome] || e.all; else col = new THREE.Color().setRGB(orig.color.r, orig.color.g, orig.color.b, THREE.SRGBColorSpace);
    natMats.set(key, new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, metalness: 0 }));
  }
  return natMats.get(key);
}
function mergeNature(model, placements, biome) {
  const meshes = [];
  model.scene.updateWorldMatrix(true, true);
  model.scene.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const out = new THREE.Group();
  for (const m of meshes) {
    const geos = placements.map((p) => {
      const g = m.geometry.clone();
      const M = new THREE.Matrix4().makeRotationY(p.rot); M.scale(new THREE.Vector3(p.s, p.s, p.s)); M.setPosition(p.x, 0, p.z); M.multiply(m.matrixWorld);
      g.applyMatrix4(M); return g;
    });
    const mesh = new THREE.Mesh(mergeGeometries(geos, false), natMat(m.material, biome));
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; out.add(mesh);
  }
  return out;
}

/* small procedural props: cacti, rocks, dunes, snow mounds, snowmen */
function propsMesh(list) {
  const geos = list.map((p) => {
    let g = p.geo.index ? p.geo.toNonIndexed() : p.geo.clone();
    const M = new THREE.Matrix4().compose(new THREE.Vector3(p.x, p.y, p.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(p.rx || 0, p.ry || 0, p.rz || 0)), new THREE.Vector3(p.sx || 1, p.sy || 1, p.sz || 1));
    g.applyMatrix4(M);
    const c = new THREE.Color(p.color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    return g;
  });
  const mesh = new THREE.Mesh(mergeGeometries(geos, false), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
  mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
  return mesh;
}
const G = {
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8), sph: new THREE.SphereGeometry(1, 10, 8), ico: new THREE.IcosahedronGeometry(1, 0), cone: new THREE.ConeGeometry(1, 1, 8), dune: new THREE.SphereGeometry(1, 20, 12)
};
function cactus(list, x, z, rnd) {
  const h = 3.2 + rnd() * 2.0, col = rnd() < 0.5 ? '#5b9f52' : '#4a8c47';
  list.push({ geo: G.cyl, x, y: h / 2, z, sx: 0.5, sy: h, sz: 0.5, color: col });
  list.push({ geo: G.sph, x, y: h, z, sx: 0.5, sy: 0.5, sz: 0.5, color: col });
  for (const side of [-1, 1]) {
    if (rnd() < 0.35) continue;
    const ah = 0.8 + rnd() * 0.8, y0 = h * (0.35 + rnd() * 0.25);
    list.push({ geo: G.cyl, x: x + side * 0.75, y: y0, z, sx: 0.28, sy: 1.5, sz: 0.28, rz: Math.PI / 2, color: col });
    list.push({ geo: G.cyl, x: x + side * 1.4, y: y0 + ah / 2, z, sx: 0.28, sy: ah, sz: 0.28, color: col });
    list.push({ geo: G.sph, x: x + side * 1.4, y: y0 + ah, z, sx: 0.28, sy: 0.28, sz: 0.28, color: col });
  }
}
function rock(list, x, z, rnd, col) {
  const s = 0.5 + rnd() * 1.0;
  list.push({ geo: G.ico, x, y: s * 0.35, z, sx: s * 1.3, sy: s * 0.8, sz: s, ry: rnd() * 6, color: col });
}
function snowman(list, x, z, rnd) {
  const ry = rnd() * 6;
  list.push({ geo: G.sph, x, y: 0.7, z, sx: 0.8, sy: 0.7, sz: 0.8, color: '#ffffff' });
  list.push({ geo: G.sph, x, y: 1.7, z, sx: 0.6, sy: 0.55, sz: 0.6, color: '#ffffff' });
  list.push({ geo: G.sph, x, y: 2.5, z, sx: 0.42, sy: 0.42, sz: 0.42, color: '#ffffff' });
  list.push({ geo: G.cone, x: x + Math.sin(ry) * 0.5, y: 2.5, z: z + Math.cos(ry) * 0.5, sx: 0.1, sy: 0.5, sz: 0.1, rx: Math.PI / 2, ry, color: '#ff8a3d' });
  list.push({ geo: G.cyl, x, y: 2.9, z, sx: 0.34, sy: 0.4, sz: 0.34, color: '#3a2f6b' });
}

let ROAD_Y = 0;
let sun = null, sunTarget = null, hemi = null, worldGroup = null, weatherFx = null;
let builtKey = '';
function initLights() {
  hemi = new THREE.HemisphereLight('#ffffff', '#7a9a5a', 1.1); raceScene.add(hemi);
  sun = new THREE.DirectionalLight('#fff3d6', 2.4);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005;
  const sc = sun.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 45; sc.bottom = -45; sc.near = 1; sc.far = 160;
  sunTarget = new THREE.Object3D(); raceScene.add(sun); raceScene.add(sunTarget); sun.target = sunTarget;
}

function applyAtmosphere() {
  const B = BIOMES[MAP.style === 'space' ? 'space' : MAP.style === 'river' ? 'river' : MAP.biome], W = WEATHER_FX[WX];
  const sky = W ? W.sky : B.sky;
  if (raceScene.background && raceScene.background.dispose) raceScene.background.dispose();
  raceScene.background = skyTexture(sky);
  raceScene.fog = new THREE.Fog(W ? W.fog : B.fog, W ? W.n : B.n, W ? W.f : B.f);
  hemi.color.set('#ffffff'); hemi.groundColor.set(B.hemiG); hemi.intensity = W ? W.hemi : 1.1;
  sun.intensity = (W ? W.sun : 1) * 2.4;
}

/* weather particles that follow the camera */
function buildWeather() {
  if (weatherFx) {
    raceScene.remove(weatherFx.obj); weatherFx.obj.geometry.dispose(); weatherFx.obj.material.dispose(); weatherFx = null;
  }
  if (WX === 'clear' || WX === 'fog') return;
  const rnd = mulberry(99);
  const cfg = { rain: { n: 1100, box: [46, 26, 46] }, snow: { n: 1100, box: [46, 26, 46] }, sand: { n: 2800, box: [46, 18, 46] } }[WX];
  const off = new Float32Array(cfg.n * 3);
  for (let i = 0; i < cfg.n; i++) { off[i * 3] = rnd() * cfg.box[0]; off[i * 3 + 1] = rnd() * cfg.box[1]; off[i * 3 + 2] = rnd() * cfg.box[2]; }
  let obj;
  if (WX === 'rain') {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cfg.n * 6), 3));
    obj = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: '#d6e2ee', transparent: true, opacity: 0.5, depthWrite: false }));
  } else {
    const cv = document.createElement('canvas'); cv.width = cv.height = 32; const cx = cv.getContext('2d');
    const gr = cx.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = gr; cx.fillRect(0, 0, 32, 32);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cfg.n * 3), 3));
    obj = new THREE.Points(g, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(cv), color: WX === 'snow' ? '#ffffff' : '#e3c690', size: WX === 'snow' ? 0.3 : 0.2, transparent: true, opacity: WX === 'snow' ? 0.95 : 0.75, depthWrite: false }));
  }
  obj.frustumCulled = false; raceScene.add(obj);
  weatherFx = { obj, off, box: cfg.box, n: cfg.n };
}
const wrap = (v, s) => ((v % s) + s) % s;
function updateWeather(dt, t, cam) {
  if (!weatherFx) return;
  const { off, box, n, obj } = weatherFx; const pos = obj.geometry.attributes.position.array;
  const fall = WX === 'rain' ? 34 : WX === 'snow' ? 2.4 : 0.4, wx = WX === 'rain' ? 3 : WX === 'snow' ? 0.8 : 15, wz = WX === 'sand' ? 2 : 0;
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    off[k] += (wx + (WX === 'snow' ? Math.sin(t * 0.9 + i) * 0.6 : 0)) * dt; off[k + 1] -= fall * dt; off[k + 2] += (wz + (WX === 'snow' ? Math.cos(t * 0.7 + i * 1.7) * 0.6 : 0)) * dt;
    const x = cam.x + wrap(off[k] - cam.x, box[0]) - box[0] / 2;
    const y = cam.y + wrap(off[k + 1] - cam.y, box[1]) - box[1] / 2 + (WX === 'sand' ? 3 : 6);
    const z = cam.z + wrap(off[k + 2] - cam.z, box[2]) - box[2] / 2;
    if (WX === 'rain') { const j = i * 6; pos[j] = x; pos[j + 1] = y; pos[j + 2] = z; pos[j + 3] = x - 0.08; pos[j + 4] = y + 0.95; pos[j + 5] = z; }
    else { pos[k] = x; pos[k + 1] = y; pos[k + 2] = z; }
  }
  obj.geometry.attributes.position.needsUpdate = true;
}


/* ------------------------------------------------------------------ Skyway Circuit: only Kenney City Roads Kit pieces */
const C2_ARC = (cx, cz, r, a0, a1, n) => { const o = []; for (let k = 0; k <= n; k++) { const a = a0 + (a1 - a0) * k / n; o.push([cx + r * Math.cos(a), cz + r * Math.sin(a), 0]); } return o; };
const C2P = {
  line: [[-0.5, 0, 0], [0.5, 0, 0]],
  ramp: [[-0.5, 0, 0], [0.5, 0, 2.5]],
  bend: C2_ARC(-0.5, 0.5, 0.5, 0, -Math.PI / 2, 14),
  curve: C2_ARC(-1, 1, 1.5, 0, -Math.PI / 2, 26),
  rbt: C2_ARC(-1.5, 1.5, 1.5, -Math.PI / 2, 0, 26)
};
let C2 = null;
function c2Program() {
  const P = [];
  for (let i = 0; i < 6; i++) P.push({ k: 'line', t: 'S', mesh: i === 3 ? 'bridge' : 'straight' });
  P.push({ k: 'rbt', t: 'R' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'curve', t: 'R' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'curve', t: 'R' });
  P.push({ k: 'ramp', t: 'S', mesh: 'ramp1' }, { k: 'ramp', t: 'S', mesh: 'ramp2' }, { k: 'line', t: 'S', mesh: 'deck', flat: true });
  P.push({ k: 'ramp', t: 'S', mesh: 'ramp2', rev: true }, { k: 'ramp', t: 'S', mesh: 'ramp1', rev: true });
  P.push({ k: 'curve', t: 'L' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'bend', t: 'L' });
  for (let i = 0; i < 3; i++) P.push({ k: 'line', t: 'S', mesh: 'straight' });
  P.push({ k: 'bend', t: 'L' });
  return P;
}
function buildTrackC2(map) {
  const rot = (x, z, k) => { const c = Math.round(Math.cos(k * Math.PI / 2)), s = Math.round(Math.sin(k * Math.PI / 2)); return [x * c + z * s, -x * s + z * c]; };
  let cx = 0.5, cz = 4, h = [1, 0], y = 0.2;
  const pts = [{ x: cx, z: cz, y }], placed = [], rng = [];
  for (const it of c2Program()) {
    let done = false;
    for (const rev of (it.rev === undefined ? [false, true] : [it.rev])) {
      let P = C2P[it.k]; if (rev) P = P.slice().reverse();
      const n = P.length, u0 = [P[1][0] - P[0][0], P[1][1] - P[0][1]], u1 = [P[n - 1][0] - P[n - 2][0], P[n - 1][1] - P[n - 2][1]];
      const snap = (v) => (Math.abs(v[0]) > Math.abs(v[1]) ? [Math.sign(v[0]), 0] : [0, Math.sign(v[1])]); const s0 = snap(u0), s1 = snap(u1); u0[0] = s0[0]; u0[1] = s0[1]; u1[0] = s1[0]; u1[1] = s1[1];
      const cr = u0[0] * u1[1] - u0[1] * u1[0], turn = Math.abs(cr) < 0.05 ? 'S' : cr > 0 ? 'R' : 'L';
      if (turn !== it.t) continue;
      for (let k = 0; k < 4; k++) {
        const r0 = rot(u0[0], u0[1], k); if (Math.hypot(r0[0] - h[0], r0[1] - h[1]) > 0.01) continue;
        const rp0 = rot(P[0][0], P[0][1], k), T = [cx - rp0[0], cz - rp0[1]];
        const i0 = pts.length - 1; let yEnd = y;
        for (let q = 1; q < n; q++) { const rp = rot(P[q][0], P[q][1], k); yEnd = y + (P[q][2] - P[0][2]); pts.push({ x: T[0] + rp[0], z: T[1] + rp[1], y: it.flat ? y : y + (P[q][2] - P[0][2]) }); }
        placed.push({ it, k, theta: k * Math.PI / 2, T, yb: Math.min(y, it.flat ? y : yEnd) - 0.2, up: !rev });
        rng.push([i0, pts.length - 1, it.t !== 'S']);
        const e = pts[pts.length - 1]; cx = e.x; cz = e.z; y = it.flat ? y : yEnd; h = rot(u1[0], u1[1], k); done = true; break;
      }
      if (done) break;
    }
    if (!done) console.warn('c2 chain failed', it);
  }
  const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
  const mx = (Math.min(...xs) + Math.max(...xs)) / 2, mz = (Math.min(...zs) + Math.max(...zs)) / 2;
  PTS.length = 0; CUM.length = 0; SEGS.length = 0; TAN.length = 0; CELLS = [];
  const idxMap = [];
  for (const p of pts) { const q = { x: (p.x - mx) * 10, z: (p.z - mz) * 10, y: p.y }; const l = PTS[PTS.length - 1]; if (!l || Math.hypot(l.x - q.x, l.z - q.z) > 1e-4) PTS.push(q); else l.y = Math.max(l.y, q.y); idxMap.push(PTS.length - 1); }
  CUM.push(0);
  for (let n = 1; n < PTS.length; n++) CUM.push(CUM[n - 1] + Math.hypot(PTS[n].x - PTS[n - 1].x, PTS[n].z - PTS[n - 1].z));
  TRACK_LEN = CUM[CUM.length - 1];
  for (let n = 0; n < PTS.length; n++) {
    const p = PTS[(n - 1 + PTS.length) % PTS.length], q = PTS[(n + 1) % PTS.length];
    const dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; TAN.push({ x: dx / l, z: dz / l });
  }
  for (const [a, b, c] of rng) SEGS.push({ a: CUM[idxMap[a]], b: CUM[idxMap[b]], corner: c });
  C2 = { placed, mx, mz, end: pts[pts.length - 1] };
  START_OFFSET = 15; MAP = map; LAPS = map.laps;
}
function buildC2(group) {
  ROAD_Y = 0.2;
  const B = {}; const putM = (nm, M) => { (B[nm] = B[nm] || []).push(M); };
  const mat = (tx, ty, tz, th, sx, sy, sz) => new THREE.Matrix4().makeTranslation(tx, ty, tz).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sx, sy, sz));
  const W = (v, c) => (v - c) * 10;
  for (const pc of C2.placed) {
    const wx = W(pc.T[0], C2.mx), wz = W(pc.T[1], C2.mz), th = pc.theta, m = pc.it.mesh, k = pc.it.k;
    if (m === 'straight') { putM('road_straight', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_straight_barrier', mat(wx, 0, wz, th + Math.PI / 2, 10, 10, 10)); }
    else if (m === 'bridge') { putM('road_bridge', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (k === 'bend') { putM('road_bend', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_bend_barrier', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (k === 'curve') { putM('road_curve', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_curve_barrier', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (k === 'rbt') { putM('road_roundabout', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_roundabout_barrier', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (m === 'ramp1') { putM('road_slant_high', mat(wx, pc.yb, wz, th, 10, 5, 10)); putM('road_slant_high_barrier', mat(wx, pc.yb, wz, th, 10, 5, 10)); }
    else if (m === 'ramp2') {
      putM('road_slant_flat_high', mat(wx, pc.yb, wz, th, 10, 5, 10));
      const f = [Math.cos(th), -Math.sin(th)], n = [f[1], -f[0]];
      for (const sd of [-1, 1]) putM('bridge_pillar', mat(wx + n[0] * sd * 3.9, 0, wz + n[1] * sd * 3.9, 0, 10, (pc.yb + 1.3) / 5, 10));
    }
  }
  for (const nm of Object.keys(B)) {
    const model = models['c_' + nm]; if (!model) { console.warn('missing', nm); continue; }
    model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(o.matrixWorld)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
  // street furniture
  const P = {}; const put = (name, x, z, rot, s, y) => { (P[name] = P[name] || []).push({ x, z, rot, s, y: y || 0 }); };
  const prnd = mulberry(33);
  for (const pc of C2.placed) {
    if (pc.it.k !== 'line' || pc.it.mesh !== 'straight') continue;
    const wx = W(pc.T[0], C2.mx), wz = W(pc.T[1], C2.mz), alongX = Math.abs(Math.cos(pc.theta)) > 0.5, i = C2.placed.indexOf(pc);
    if (i % 2 === 1) {
      const lamp = i % 4 === 1 ? 'c_light_square' : 'c_light_curved';
      for (const side of [-1, 1]) {
        if (alongX) put(lamp, wx, wz + side * 5.6, side > 0 ? 0 : Math.PI, 10); else put(lamp, wx + side * 5.6, wz, side > 0 ? Math.PI / 2 : -Math.PI / 2, 10);
      }
    }
  }
  const sgn = (p, off) => { const q = pointAt(p); return { x: q.x, z: q.z, th: Math.atan2(-q.tz, q.tx), tx: q.tx, tz: q.tz }; };
  for (const sOff of [0, 34, 105, 245]) { const f = sgn(sOff); put(sOff === 0 ? 'c_sign_highway_wide' : 'c_sign_highway', f.x, f.z, f.th, 10); }
  // traffic lights at the roundabout entrance and start
  for (const sOff of [38]) { const f = sgn(sOff); for (const sd of [-1, 1]) put('c_traffic_light', f.x - f.tz * sd * 5.8, f.z + f.tx * sd * 5.8, f.th + (sd > 0 ? 0 : Math.PI), 10); }
  for (const nm of Object.keys(P)) if (models[nm]) group.add(mergePlacements(models[nm].scene, P[nm], 'city'));
  // start line
  { const q = pointAt(0), cv = document.createElement('canvas'); cv.width = 128; cv.height = 32; const cx = cv.getContext('2d');
    for (let a = 0; a < 16; a++) for (let b = 0; b < 4; b++) { cx.fillStyle = (a + b) % 2 ? '#15112b' : '#ffffff'; cx.fillRect(a * 8, b * 8, 8, 8); }
    const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
    const line = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 1.5), new THREE.MeshBasicMaterial({ map: ct }));
    line.rotation.set(-Math.PI / 2, 0, Math.atan2(q.tx, q.tz)); line.position.set(q.x, 0.215, q.z); group.add(line); }
  // industrial buildings on a one-tile lot grid, kept off the road
  const mnx = Math.min(...PTS.map((p) => p.x)), mxx = Math.max(...PTS.map((p) => p.x)), mnz = Math.min(...PTS.map((p) => p.z)), mxz = Math.max(...PTS.map((p) => p.z));
  const xc = (mnx + mxx) / 2, zc = (mnz + mxz) / 2, lots = [];
  for (let i = -9; i <= 9; i++) for (let j = -9; j <= 9; j++) {
    const x = xc + i * 10 + 5, z = zc + j * 10 + 5;
    let dmin = 1e9; for (const p of PTS) dmin = Math.min(dmin, Math.hypot(p.x - x, p.z - z));
    if (dmin < 10.5) continue;
    lots.push({ x, z, d: dmin });
  }
  buildIndustrial(group, lots, prnd);
}


/* Kenney City Kit (Industrial) buildings for the city maps. lots: [{x, z, d (distance to the road)}] */
const IND_BUILD = ['i_building_a', 'i_building_b', 'i_building_c', 'i_building_d', 'i_building_e', 'i_building_f', 'i_building_g', 'i_building_l', 'i_building_m', 'i_building_q', 'i_building_r', 'i_building_t'];
const indBox = {};
function indBounds(nm) {
  if (!indBox[nm]) { const m = models[nm]; m.scene.updateWorldMatrix(true, true); const b = new THREE.Box3().setFromObject(m.scene); indBox[nm] = { c: b.getCenter(new THREE.Vector3()), s: b.getSize(new THREE.Vector3()) }; }
  return indBox[nm];
}
function buildIndustrial(group, lots, prnd) {
  const B = {};
  const put = (nm, x, z, th, sc, lift) => { const b = indBounds(nm); (B[nm] = B[nm] || []).push(new THREE.Matrix4().makeTranslation(x, lift || 0, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sc, sc, sc)).multiply(new THREE.Matrix4().makeTranslation(-b.c.x, 0, -b.c.z))); return b; };
  const toward = (l) => { let bi = 0, bd = 1e9; for (let i = 0; i < PTS.length; i += 3) { const dd = Math.hypot(PTS[i].x - l.x, PTS[i].z - l.z); if (dd < bd) { bd = dd; bi = i; } } return Math.atan2(PTS[bi].x - l.x, PTS[bi].z - l.z); };
  const nat = {};
  for (const l of lots) {
    const r = prnd();
    if (r < 0.09) { for (let q = 0; q < 3; q++) { const nk = prnd() < 0.7 ? 'tree_default' : 'plant_bushLarge'; (nat[nk] = nat[nk] || []).push({ x: l.x + (prnd() - 0.5) * 7, z: l.z + (prnd() - 0.5) * 7, rot: prnd() * 6, s: 5 + prnd() * 2 }); } continue; }
    if (r < 0.2) { // yard: containers, tanks, solar panels
      const q = prnd();
      if (q < 0.4) { const th = toward(l) + (prnd() < 0.5 ? 0 : Math.PI / 2); for (let k = -1; k <= 1; k += 2) put(['i_shipping_container_a', 'i_shipping_container_b', 'i_shipping_container_c'][Math.floor(prnd() * 3)], l.x + Math.cos(th) * k * 2.8, l.z - Math.sin(th) * k * 2.8, th, 3.1); }
      else if (q < 0.65) put('i_detail_tank_large', l.x, l.z, prnd() * 6, 6);
      else if (q < 0.85) put('i_solar_panel_landscape_group', l.x, l.z, toward(l), 7.5);
      else put('i_windmill', l.x, l.z, prnd() * 6, 8);
      continue;
    }
    const nm = IND_BUILD[Math.floor(prnd() * IND_BUILD.length)], b = indBounds(nm);
    const sc = Math.min(8.4 / Math.max(b.s.x, b.s.z * 1.0), 8.4 / Math.min(b.s.x, b.s.z) * 0.62, 7.2) * (l.d > 26 ? 1.05 : 0.95);
    const th = toward(l) + (prnd() < 0.15 ? Math.PI / 2 : 0);
    put(nm, l.x + (prnd() - 0.5) * 1.2, l.z + (prnd() - 0.5) * 1.2, th, sc);
    if (prnd() < 0.22) put(prnd() < 0.5 ? 'i_chimney_large' : 'i_water_tower', l.x + (prnd() - 0.5) * 6, l.z + (prnd() - 0.5) * 6 + 4.5, 0, 6.5);
  }
  for (const nm of Object.keys(B)) {
    const model = models[nm]; model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(o.matrixWorld)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
  for (const nm of Object.keys(nat)) group.add(mergeNature(models[nm], nat[nm], 'forest'));
}


/* Kenney City Kit (Commercial) towers for Downtown Dash */
const COM_NEAR = ['m_building_a', 'm_building_b', 'm_building_d', 'm_building_f', 'm_building_g', 'm_building_h', 'm_building_i', 'm_building_l', 'm_building_m'];
const COM_TALL = ['m_building_skyscraper_a', 'm_building_skyscraper_c', 'm_building_skyscraper_d', 'm_building_skyscraper_e'];
const COM_LOW = ['m_low_detail_building_a', 'm_low_detail_building_c', 'm_low_detail_building_g', 'm_low_detail_building_h', 'm_low_detail_building_m'];
function buildCommercial(group, lots, prnd) {
  const B = {}, box = {};
  const bounds = (nm) => { if (!box[nm]) { const m = models[nm]; m.scene.updateWorldMatrix(true, true); const b = new THREE.Box3().setFromObject(m.scene); box[nm] = { c: b.getCenter(new THREE.Vector3()), s: b.getSize(new THREE.Vector3()) }; } return box[nm]; };
  const put = (nm, x, z, th, sc) => { const b = bounds(nm); (B[nm] = B[nm] || []).push(new THREE.Matrix4().makeTranslation(x, 0, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sc, sc, sc)).multiply(new THREE.Matrix4().makeTranslation(-b.c.x, 0, -b.c.z))); return b; };
  const toward = (l) => { let bi = 0, bd = 1e9; for (let i = 0; i < PTS.length; i += 3) { const dd = Math.hypot(PTS[i].x - l.x, PTS[i].z - l.z); if (dd < bd) { bd = dd; bi = i; } } return Math.atan2(PTS[bi].x - l.x, PTS[bi].z - l.z); };
  const nat = {}; const pick = (a) => a[Math.floor(prnd() * a.length)];
  for (const l of lots) {
    const r = prnd();
    if (r < 0.1) { for (let q = 0; q < 3; q++) { const nk = prnd() < 0.7 ? 'tree_default' : 'plant_bushLarge'; (nat[nk] = nat[nk] || []).push({ x: l.x + (prnd() - 0.5) * 7, z: l.z + (prnd() - 0.5) * 7, rot: prnd() * 6, s: 5 + prnd() * 2 }); } continue; }
    const th = toward(l);
    if (l.d < 24) { const nm = pick(COM_NEAR), b = bounds(nm); put(nm, l.x + (prnd() - 0.5), l.z + (prnd() - 0.5), th, Math.min(7 / Math.max(b.s.x, b.s.z), 8.5) * (0.9 + prnd() * 0.15)); }
    else if (l.d < 48 || prnd() < 0.35) { const nm = pick(COM_TALL), b = bounds(nm); put(nm, l.x, l.z, th, 7.2 / Math.max(b.s.x, b.s.z) * (0.9 + prnd() * 0.25)); }
    else { const nm = pick(COM_LOW); put(nm, l.x, l.z, th, 12 + prnd() * 5); }
  }
  for (const nm of Object.keys(B)) {
    const model = models[nm]; model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(o.matrixWorld)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
  for (const nm of Object.keys(nat)) group.add(mergeNature(models[nm], nat[nm], 'forest'));
}

/* ---------------------------------------------------------- city */
let winTex = null;
function windowTexture() {
  if (winTex) return winTex;
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const cx = cv.getContext('2d');
  cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, 64, 64);
  cx.fillStyle = '#d6dbe6'; cx.fillRect(0, 56, 64, 8);
  cx.fillStyle = '#2f3d5c'; cx.fillRect(14, 14, 36, 34);
  cx.fillStyle = '#6f93c4'; cx.fillRect(14, 14, 36, 12);
  cx.fillStyle = '#9fbbe0'; cx.fillRect(14, 14, 8, 34);
  winTex = new THREE.CanvasTexture(cv); winTex.colorSpace = THREE.SRGBColorSpace; winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping; winTex.anisotropy = 4;
  return winTex;
}
function boxBuilding(x, z, w, d, h, color) {
  const g = new THREE.BoxGeometry(w, h, d); g.translate(x, h / 2, z);
  const uv = g.attributes.uv, pitch = 3.4;
  const fw = [d, d, 1, 1, w, w];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) {
    const i = f * 4 + v;
    if (f === 2 || f === 3) uv.setXY(i, 0.03, 0.03);
    else uv.setXY(i, uv.getX(i) * fw[f] / pitch, uv.getY(i) * h / pitch);
  }
  const c = new THREE.Color(color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}
/* Racing-kit road for the cell maps: same kerbed asphalt, red/white barriers and flyover pieces as Grand Prix */
function cellRoad(group) {
  const B = {}; const put = (n, M) => { (B[n] = B[n] || []).push(M); };
  const dIdx = (d) => GP_DIR.findIndex((v) => v[0] === d[0] && v[1] === d[1]);
  const place = (name, wx, wz, d, L, rev) => {
    const M = rev ? gpMat(wx, wz, gpRotFor(0, 1, d), GP_SC, 0.5, -L, 0) : gpMat(wx, wz, gpRotFor(0, -1, d), GP_SC, 0.5, 0, 0);
    put(name, M);
  };
  const barrier = (nm, px, pz, tx, tz, y) => { // 2.5-long red or white block, centred on (px,pz), lying along (tx,tz)
    const th = Math.atan2(-tz, tx);
    put(nm, new THREE.Matrix4().makeTranslation(px, y, pz).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(GP_SC, GP_SC * 0.5, GP_SC * 0.8)).multiply(new THREE.Matrix4().makeTranslation(-0.125, 0, 0.0615)));
  };
  CELLS.forEach((c, idx) => {
    const [cx, cz] = cellCenter(c);
    const ex = cx - c.d[0] * 5, ez = cz - c.d[1] * 5;
    if (c.ramp) {
      if (c.rIdx === 0) place('roadRampLong', ex, ez, c.d, 2, c.ramp === 'down');
      return;
    }
    if (c.corner) {
      const right = dIdx(c.d2) === (dIdx(c.d) + 1) % 4;
      for (const nm of ['roadCornerSmall', 'roadCornerSmallBorder']) {
        const M = right ? gpMat(ex, ez, gpRotFor(0, -1, c.d), GP_SC, 0.5, 0, 0) : gpMat(ex, ez, gpRotFor(-1, 0, c.d), GP_SC, 1, -0.5, 0);
        put(nm, M);
      }
      // red and white barrier blocks round the outside of the bend
      const ax = cx + (-c.d[0] + c.d2[0]) * 5, az = cz + (-c.d[1] + c.d2[1]) * 5;
      const a0 = Math.atan2(ez - az, ex - ax), a1 = Math.atan2(cz + c.d2[1] * 5 - az, cx + c.d2[0] * 5 - ax);
      let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      const R = 10.9, n = 6;
      for (let k = 0; k < n; k++) {
        const a = a0 + da * (k + 0.5) / n, tg = Math.sign(da);
        barrier(k % 2 ? 'barrierWhite' : 'barrierRed', ax + R * Math.cos(a), az + R * Math.sin(a), -Math.sin(a) * tg, Math.cos(a) * tg, c.y0 - 0.2);
      }
      return;
    }
    place(c.elev ? 'roadStraightBridgeMid' : 'roadStraight', ex, ez, c.d, 1, false);
    const ny = c.elev ? 0.2 + 5.0 : 0;
    for (const sd of [-1, 1]) {
      const lx = -c.d[1] * sd * 5.9, lz = c.d[0] * sd * 5.9;
      for (let k = 0; k < 4; k++) {
        const off = (k - 1.5) * 2.5;
        barrier((k + idx) % 2 ? 'barrierWhite' : 'barrierRed', cx + lx + c.d[0] * off, cz + lz + c.d[1] * off, c.d[0], c.d[1], ny);
      }
    }
  });
  // start gantry
  { const p = pointAt(0), f = { x: p.x, z: p.z, nx: -p.tz, nz: p.tx }; put('overhead', gpMat(f.x, f.z, Math.atan2(-f.nz, f.nx), GP_SC, 0.5, 0.1, 0)); }
  for (const nm of Object.keys(B)) {
    const model = models['gp_' + nm]; if (!model) continue;
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}
function buildCity(group, occ, prnd) {
  if (MAP.style === 'space') { buildSpace(group, occ, prnd); return; }
  ROAD_Y = 0.2;
  const P = {}; const put = (name, x, z, rot, s, y) => { (P[name] = P[name] || []).push({ x, z, rot, s, y: y || 0 }); };
  CELLS.forEach((c, idx) => {
    const [x, z] = cellCenter(c);
    if (c.cross || c.ramp) return;
    if (c.corner) {
      const ax = x + (-c.d[0] + c.d2[0]) * 5, az = z + (-c.d[1] + c.d2[1]) * 5;
      const nx = (c.d[0] - c.d2[0]) / Math.SQRT2, nz = (c.d[1] - c.d2[1]) / Math.SQRT2;
      put('c_road_sign_warning', ax + nx * 12.6, az + nz * 12.6, Math.atan2(-nx, -nz) + Math.PI / 2, 10);
      put('c_construction_cone', ax + nx * 11.8 + nz * 1.2, az + nz * 11.8 - nx * 1.2, 0, 10);
      put('c_construction_cone', ax + nx * 11.8 - nz * 1.2, az + nz * 11.8 + nx * 1.2, 1, 10);
      return;
    }
    if (idx % 2 === 1 && idx !== 1) {
      const lamp = idx % 4 === 1 ? 'c_light_square' : 'c_light_curved';
      for (const side of [-1, 1]) {
        if (c.d[0] !== 0) put(lamp, x + (idx % 3 - 1) * 1.5, z + side * 7.6, side > 0 ? 0 : Math.PI, 10);
        else put(lamp, x + side * 7.6, z + (idx % 3 - 1) * 1.5, side > 0 ? Math.PI / 2 : -Math.PI / 2, 10);
      }
    }
    if (idx !== 0 && prnd() < 0.12) put(prnd() < 0.5 ? 'c_dumpster' : 'c_construction_barrier', c.d[0] !== 0 ? x + (prnd() - 0.5) * 6 : x + (prnd() < 0.5 ? -8.4 : 8.4), c.d[0] !== 0 ? z + (prnd() < 0.5 ? -8.4 : 8.4) : z + (prnd() - 0.5) * 6, prnd() * 6, 10);
  });
  cellRoad(group);
  for (const nm of Object.keys(P)) group.add(mergePlacements(models[nm].scene, P[nm], 'city'));
  const P0 = P;

  // start line
  const sc0 = CELLS[0], [sx, sz] = cellCenter(sc0);
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 32; const cx = cv.getContext('2d');
  for (let a = 0; a < 16; a++) for (let b = 0; b < 4; b++) { cx.fillStyle = (a + b) % 2 ? '#15112b' : '#ffffff'; cx.fillRect(a * 8, b * 8, 8, 8); }
  const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
  const line = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 1.5), new THREE.MeshBasicMaterial({ map: ct }));
  line.rotation.x = -Math.PI / 2; line.position.set(sx, 0.215, sz); if (sc0.d[0] === 0) line.rotation.z = 0; else line.rotation.z = Math.PI / 2;
  group.add(line);

  if (MAP.style === 'space') { buildSpace(group, occ, prnd); return; }
  // industrial buildings and yards on the lots beside the road
  const lots = [], cx0 = (BOUNDS.minI + BOUNDS.maxI) / 2, cz0 = (BOUNDS.minJ + BOUNDS.maxJ) / 2;
  for (let i = BOUNDS.minI - 4; i <= BOUNDS.maxI + 4; i++) for (let j = BOUNDS.minJ - 4; j <= BOUNDS.maxJ + 4; j++) {
    if (occ.has(i + ',' + j)) continue;
    const dist = Math.max(Math.abs(i - clampI(i)), Math.abs(j - clampJ(j)));
    lots.push({ x: (i - cx0) * TILE, z: (j - cz0) * TILE, d: 10 + dist * 10 });
  }
  buildCommercial(group, lots, prnd);
}

/* Kenney Space Kit: Mars outpost */
const spaceMats = new Map();
function spaceMat(m, ter) {
  const kk = ter ? m.uuid + 't' : m.uuid;
  if (!spaceMats.has(kk)) { const c = m.clone(); c.metalness = 0.0; c.roughness = 0.8; if (ter && (m.name === 'rock' || m.name === 'rockDark')) c.color.multiply(new THREE.Color(1, 0.72, 0.58)); if (ter && m.name === 'rockTrack') c.color.set('#6a3226'); spaceMats.set(kk, c); }
  return spaceMats.get(kk);
}
function buildSpace(group, occ, prnd) {
  ROAD_Y = 0.05;
  const B = {};
  const mk = (x, y, z, th, sx, sy, sz) => new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sx, sy || sx, sz || sx));
  const put = (n, M) => { (B[n] = B[n] || []).push(M); };
  CELLS.forEach((c) => {
    const [cx, cz] = cellCenter(c);
    if (c.corner) {
      const a = (c.d2[0] === c.d[1] && c.d2[1] === -c.d[0]) ? [c.d[0], c.d[1]] : [-c.d2[0], -c.d2[1]];
      put('s_terrain_roadCorner', mk(cx, 0.05, cz, Math.atan2(-a[1], a[0]), 10));
    } else put('s_terrain_roadStraight', mk(cx, 0.05, cz, Math.atan2(c.d[0], c.d[1]), 10));
  });
  // start gate and chequered line
  const sc00 = CELLS[0], [gx, gz] = cellCenter(sc00), n0 = { x: -sc00.d[1], z: sc00.d[0] };
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 32; const cxx = cv.getContext('2d');
  for (let a = 0; a < 16; a++) for (let b = 0; b < 4; b++) { cxx.fillStyle = (a + b) % 2 ? '#15112b' : '#ffffff'; cxx.fillRect(a * 8, b * 8, 8, 8); }
  const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
  const line = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 1.5), new THREE.MeshBasicMaterial({ map: ct }));
  const sc0 = CELLS[0], [sx, sz] = cellCenter(sc0);
  line.rotation.x = -Math.PI / 2; line.position.set(sx, 0.12, sz); line.rotation.z = sc0.d[0] === 0 ? 0 : Math.PI / 2;
  group.add(line);
  // island diorama: terrain tiles, sloping rim, raised mesas, monorail, rocket, base
  const gnd = group.children[0]; if (gnd && gnd.isMesh) { gnd.position.y = -5.2; gnd.material = gnd.material.clone(); gnd.material.color.set('#4a2226'); }
  const K = (v) => Math.round((v - 5) / 10), W = (k) => k * 10 + 5;
  const road = new Set(); CELLS.forEach((c) => { const [x, z] = cellCenter(c); road.add(K(x) + ',' + K(z)); });
  const nearRoad = (i, j) => { for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (road.has((i + a) + ',' + (j + b))) return true; return false; };
  const I0 = -7, I1 = 6, J0 = -5, J1 = 4;
  const used = new Set();
  const mesa = (x0, x1, z0, z1) => { // world-edge rectangle (multiples of 10)
    const i0 = K(x0 + 5), i1 = K(x1 - 5), j0 = K(z0 + 5), j1 = K(z1 - 5), cxm = (i0 + i1) / 2, czm = (j0 + j1) / 2;
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
      used.add(i + ',' + j);
      const edgeX = i === i0 || i === i1, edgeZ = j === j0 || j === j1;
      if (!edgeX && !edgeZ) { put('s_terrain', mk(W(i), 5, W(j), 0, 10)); continue; }
      let ix = 0, iz = 0;
      if (edgeX) ix = i === i0 ? 1 : -1; else iz = j === j0 ? 1 : -1;
      put('s_terrain_ramp', mk(W(i), 0, W(j), Math.atan2(ix, iz), 10));
      if (edgeX && edgeZ) put('s_terrain_ramp', mk(W(i), 0, W(j), Math.atan2(0, j === j0 ? 1 : -1), 10));
    }
  };
  mesa(-30, 0, -20, 20); mesa(40, 60, -10, 10); mesa(-60, -40, 30, 50); mesa(20, 40, 30, 50);
  for (let i = I0; i <= I1; i++) for (let j = J0; j <= J1; j++) {
    const k = i + ',' + j; if (used.has(k) || road.has(k)) continue;
    const eX = i === I0 || i === I1, eZ = j === J0 || j === J1;
    if (!eX && !eZ) { put('s_terrain', mk(W(i), -0.04, W(j), 0, 10)); continue; }
    let ox = 0, oz = 0; if (eZ) oz = j === J0 ? -1 : 1; else ox = i === I0 ? -1 : 1;
    put('s_terrain_side', mk(W(i), 0, W(j), Math.atan2(-ox, -oz), 10));
  }
  // monorail over the road, resting on supports
  const MZ = -5;
  for (let x = -15; x <= 45; x += 10) {
    put('s_monorail_trackStraight', mk(x, 5, MZ, Math.PI / 2, 10));
    if (x > -5 && x < 45 && Math.abs(x - 35) > 6) put('s_monorail_trackSupport', mk(x, 0, MZ, 0, 10));
  }
  const tr = ['s_monorail_trainFront', 's_monorail_trainPassenger', 's_monorail_trainPassenger', 's_monorail_trainEnd'];
  tr.forEach((n, q) => put(n, mk(24 - q * 7.2, 6.3, MZ, -Math.PI / 2, 7.2)));
  // launch pad rocket on the big mesa
  { const rx = -15, rz = 0, S = 4.6; put('s_rocket_baseA', mk(rx, 5, rz, 0, S)); put('s_rocket_sidesA', mk(rx, 5 + 1.6 * S, rz, 0, S)); put('s_rocket_topA', mk(rx, 5 + 2.6 * S, rz, 0, S)); }
  put('s_hangar_largeA', mk(-22, 5, 14, Math.PI / 2, 2.2)); put('s_satelliteDish_large', mk(-8, 5, 12, 2.3, 5)); put('s_machine_generatorLarge', mk(-23, 5, -14, 0.6, 3));
  // pipe line and base buildings in the free north-east infield
  for (let x = 12; x <= 26; x += 5) put('s_pipe_straight', mk(x, 0, -13, Math.PI / 2, 5));
  put('s_pipe_end', mk(9.5, 0, -13, -Math.PI / 2, 5)); put('s_pipe_end', mk(29.5, 0, -13, Math.PI / 2, 5)); put('s_pipe_ring', mk(19, 0, -13, Math.PI / 2, 5));
  [[12, -38, 0], [28, -38, 1]].forEach(([x, z, r]) => put(r ? 's_hangar_smallB' : 's_hangar_smallA', mk(x, 0, z, 0, 3)));
  // main base in the south-east pocket
  put('s_hangar_largeB', mk(20, 0, 18.5, 0, 3.4)); put('s_hangar_roundA', mk(16, 0, 38, 0.4, 3.4)); put('s_structure_detailed', mk(27, 0, 22, 0.5, 5)); put('s_structure_detailed', mk(30, 0, 33, 0, 5));
  put('s_rover', mk(12, 0, -9, 0.8, 4)); put('s_astronautB', mk(-8, 5, -10, 2, 4)); put('s_barrels', mk(26, 0, -9, 0, 4));
  put('s_craft_speederC', mk(-45, 16, -30, 0.7, 5)); put('s_craft_speederA', mk(52, 20, 25, 3.8, 5)); put('s_craft_speederC', mk(8, 30, -40, 2.2, 4));
  // scatter rocks, craters and outposts over the remaining plain
  const rnd = (a, b) => a + (b - a) * prnd();
  const fixed = [[-5, 9], [-5, 11], [2, 1], [3, 1], [2, 3], [3, 3], [1, 3], [3, 0]];
  for (let i = I0 + 1; i < I1; i++) for (let j = J0 + 1; j < J1; j++) {
    const k = i + ',' + j; if (used.has(k) || road.has(k)) continue;
    if (i >= 1 && i <= 3 && j >= -2 && j <= -1) continue; // pipes
    if (i >= 1 && i <= 3 && j >= 1 && j <= 3 && prnd() < 0.9) continue; // base zone
    const x = W(i), z = W(j), q = prnd(), near = nearRoad(i, j);
    if (q < 0.25) put(prnd() < 0.5 ? 's_crater' : 's_craterLarge', mk(x + rnd(-1, 1), 0.04, z + rnd(-1, 1), rnd(0, 6.3), rnd(6, 9)));
    else if (q < 0.5) { const n = near ? 1 : 2 + Math.floor(prnd() * 2); for (let t = 0; t < n; t++) put(['s_rock_largeA', 's_rock_largeB', 's_rocks_smallA', 's_rocks_smallB', 's_rock_crystalsLargeA', 's_rock_crystalsLargeB', 's_meteor'][Math.floor(prnd() * 7)], mk(x + rnd(-3, 3), 0, z + rnd(-3, 3), rnd(0, 6.3), near ? rnd(1.6, 2.6) : rnd(2.8, 4.5))); }
    else if (q < 0.6) put('s_satelliteDish', mk(x, 0, z, rnd(0, 6.3), 5));
    else if (!near && q < 0.7) put(['s_hangar_smallA', 's_hangar_smallB', 's_hangar_roundA', 's_hangar_largeA'][Math.floor(prnd() * 4)], mk(x, 0, z, Math.floor(prnd() * 4) * Math.PI / 2, 2.6));
  }
  // keep every prop clear of the road
  const roadC = CELLS.map((c) => cellCenter(c)), dropped = [];
  for (const nm of Object.keys(B)) {
    if (/terrain|monorail|pipe|supports/.test(nm) || !models[nm]) continue;
    const bb = new THREE.Box3().setFromObject(models[nm].scene), sz = bb.getSize(new THREE.Vector3()), rr0 = 0.5 * Math.max(sz.x, sz.z);
    B[nm] = B[nm].filter((M) => {
      const x = M.elements[12], y = M.elements[13], z = M.elements[14], sc = Math.hypot(M.elements[0], M.elements[1], M.elements[2]);
      if (y > 8) return true;
      const r = rr0 * sc + 2;
      const hit = roadC.some(([cx, cz]) => Math.abs(x - cx) < 5 + r && Math.abs(z - cz) < 5 + r);
      if (hit) dropped.push(nm + '@' + Math.round(x) + ',' + Math.round(z));
      return !hit;
    });
  }
  window.__dropped = dropped;
  for (const nm of Object.keys(B)) {
    const model = models[nm]; if (!model || !B[nm].length) continue;
    model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      let top = o; while (top.parent && top.parent !== model.scene) top = top.parent;
      const rel = top.matrixWorld.clone().invert().multiply(o.matrixWorld);
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); if (nm === 's_terrain_roadCorner') g.translate(-0.5, 0, 0.5); g.applyMatrix4(M.clone().multiply(rel)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), spaceMat(o.material, nm.indexOf('s_terrain') === 0)); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}
/* Kenney Nature Kit river tiles + Watercraft Pack: Harbor Run */
function buildRiver(group) {
  ROAD_Y = 0;
  const F = 10 * CELLF, prnd = mulberry(91);
  const gnd = group.children[0]; if (gnd && gnd.isMesh) { gnd.position.y = -0.03 * F; gnd.material = gnd.material.clone(); gnd.material.roughness = 0.35; gnd.material.metalness = 0; }
  const B = {};
  const put = (nm, x, y, z, th, sx, sy, sz) => { (B[nm] = B[nm] || []).push(new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz))); };
  const occ = new Set(CELLS.map((c) => c.i + ',' + c.j));
  CELLS.forEach((c) => {
    const [x, z] = cellCenter(c);
    if (!c.corner) { put('nr_riverStraight', x, 0, z, Math.atan2(c.d[0], c.d[1]), F); return; }
    const a = [-c.d[0], -c.d[1]], b = c.d2; let th = 0;
    for (let k = 0; k < 4; k++) { const cs = Math.round(Math.cos(k * Math.PI / 2)), sn = Math.round(Math.sin(k * Math.PI / 2)); const e1 = [sn, cs], e2 = [cs, -sn]; if ((same(e1, a) && same(e2, b)) || (same(e1, b) && same(e2, a))) { th = k * Math.PI / 2; break; } }
    put('nr_riverBend', x, 0, z, th, F);
  });
  // Nature Kit scenery: cliffs + waterfalls, camp, farm, plaza, beach, meadows
  const cx0 = (BOUNDS.minI + BOUNDS.maxI) / 2, cz0 = (BOUNDS.minJ + BOUNDS.maxJ) / 2, M = 4;
  const blobs = [];
  const BLOBR = { tree: 0.3, tent: 0.45, rock: 0.4, stone: 0.4, log: 0.35, statue: 0.2, palm: 0.2, canoe: 0.5, mushroom: 0.2, bush: 0.4, stump: 0.3, campfire: 0.3, sign: 0.15, crops_corn: 0.15, crop_: 0.3 };
  const P = (name, px, pz, s, y, th) => {
    put(name, px, y || 0, pz, th === undefined ? prnd() * 6.28 : th, s);
    const k = Object.keys(BLOBR).find((k2) => name.indexOf(k2) === 0 || name.indexOf('_' + k2) >= 0);
    if (k) blobs.push([px, (y || 0) + 0.15, pz, s * BLOBR[k]]);
  };
  const R = (a, b) => a + prnd() * (b - a), pick = (arr) => arr[Math.floor(prnd() * arr.length)];
  const inRange = (i, j) => i >= BOUNDS.minI && i <= BOUNDS.maxI && j >= BOUNDS.minJ && j <= BOUNDS.maxJ;
  // interior cells = not reachable from outside without crossing the canal
  const seen = new Set(), q = [[BOUNDS.minI - M, BOUNDS.minJ - M]];
  seen.add(q[0].join(','));
  while (q.length) { const [i, j] = q.pop(); for (const [a2, b2] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = i + a2, nj = j + b2, k = ni + ',' + nj; if (ni < BOUNDS.minI - M || ni > BOUNDS.maxI + M || nj < BOUNDS.minJ - M || nj > BOUNDS.maxJ + M || seen.has(k) || occ.has(k)) continue; seen.add(k); q.push([ni, nj]); } }
  const inner = []; for (let i = BOUNDS.minI; i <= BOUNDS.maxI; i++) for (let j = BOUNDS.minJ; j <= BOUNDS.maxJ; j++) if (!occ.has(i + ',' + j) && !seen.has(i + ',' + j)) inner.push([i, j]);
  const FALL = ['tree_oak_fall', 'tree_default_fall', 'tree_fat_fall', 'tree_tall_fall'];
  const GREEN = ['tree_oak', 'tree_default', 'tree_fat', 'tree_pineSmallA', 'tree_pineTallA', 'tree_pineTallD', 'tree_tall'];
  const flowers = (x, z, n, rad) => { for (let t = 0; t < n; t++) P(pick(['flower_redA', 'flower_yellowA', 'flower_purpleA']), x + R(-rad, rad), z + R(-rad, rad), R(7, 10)); };
  const camp = (x, z) => {
    P('campfire_logs', x, z, 14); P('tent_detailedOpen', x - 0.2 * F, z - 0.12 * F, 14, 0, 0.6); P('tent_smallOpen', x + 0.2 * F, z - 0.15 * F, 14, 0, -0.7);
    P('log_stack', x + 0.05 * F, z + 0.3 * F, 10); P('canoe', x - 0.22 * F, z + 0.24 * F, 14, 0, 1.2); P('sign', x + 0.25 * F, z + 0.2 * F, 14, 0, 0.3);
    for (const [a2, b2] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) P(pick(FALL), x + a2 * 0.36 * F, z + b2 * 0.36 * F, R(9, 12));
  };
  const farm = (x, z) => {
    const s = 0.26 * F, crops = ['crops_cornStageD', 'crop_pumpkin', 'crop_melon', 'crops_wheatStageB'];
    for (let a2 = -1; a2 <= 1; a2++) for (let b2 = -1; b2 <= 1; b2++) {
      const tx = x + a2 * s, tz = z + b2 * s; P('crops_dirtDoubleRow', tx, tz, s * 1.02, 0, 0);
      const cr = crops[(a2 + 1 + (b2 + 1) * 2) % 4];
      for (const o of [-0.25, 0.25]) P(cr, tx + o * s, tz + o * s * (b2 ? 1 : -1), cr === 'crops_cornStageD' ? 9 : 8, 0.4);
    }
    for (let k = -1; k <= 1; k++) { P('fence_simple', x + k * s, z - 1.7 * s, s, 0, 0); P('fence_simple', x + k * s, z + 1.7 * s, s, 0, Math.PI); P('fence_simple', x - 1.7 * s, z + k * s, s, 0, Math.PI / 2); P('fence_simple', x + 1.7 * s, z + k * s, s, 0, -Math.PI / 2); }
  };
  const plaza = (x, z) => {
    P('statue_obelisk', x, z, 20); P('statue_head', x + 0.26 * F, z + 0.22 * F, 12); P('statue_ring', x - 0.26 * F, z - 0.2 * F, 12, 0, 0.5);
    for (let t = 0; t < 10; t++) { const a = t / 10 * 6.283; P('path_stone', x + Math.cos(a) * 0.2 * F, z + Math.sin(a) * 0.2 * F, 8, 0.1, -a); }
    for (let t = 0; t < 12; t++) { const a = t / 12 * 6.283; P(pick(['flower_redA', 'flower_yellowA', 'flower_purpleA']), x + Math.cos(a) * 0.33 * F, z + Math.sin(a) * 0.33 * F, 8); }
  };
  const beach = (x, z) => {
    P('platform_beach', x, z, F * 1.08, 0, 0);
    for (let t = 0; t < 6; t++) P('tree_palmDetailedTall', x + R(-0.3, 0.3) * F, z + R(-0.3, 0.3) * F, R(9, 13), 2);
    P('canoe', x + 0.1 * F, z + 0.1 * F, 13, 2, R(0, 3));
  };
  const meadow = (x, z, mushrooms) => {
    P(pick(FALL), x + R(-0.2, 0.2) * F, z + R(-0.2, 0.2) * F, R(11, 14)); P(pick(FALL), x + R(-0.3, 0.3) * F, z + R(-0.3, 0.3) * F, R(9, 12));
    flowers(x, z, 10, 0.32 * F);
    for (let t = 0; t < 3; t++) P(pick(['plant_bushLargeTriangle', 'plant_bushLarge']), x + R(-0.3, 0.3) * F, z + R(-0.3, 0.3) * F, R(6, 9));
    if (mushrooms) for (let t = 0; t < 7; t++) P('mushroom_redTall', x + R(-0.32, 0.32) * F, z + R(-0.32, 0.32) * F, R(10, 16));
  };
  const plan = [camp, farm, (x, z) => meadow(x, z, true), plaza, beach, (x, z) => meadow(x, z, false), beach, (x, z) => meadow(x, z, true)];
  const feat = new Map(); inner.forEach(([i, j], k) => feat.set(i + ',' + j, plan[k % plan.length]));
  for (let i = BOUNDS.minI - M; i <= BOUNDS.maxI + M; i++) for (let j = BOUNDS.minJ - M; j <= BOUNDS.maxJ + M; j++) {
    if (occ.has(i + ',' + j)) continue;
    const x = (i - cx0) * F, z = (j - cz0) * F;
    const dm = Math.max(BOUNDS.minI - i, i - BOUNDS.maxI, BOUNDS.minJ - j, j - BOUNDS.maxJ);
    if (dm >= 3) {
      // cliff wall ring: rock block + grass cap with trees on top
      const wf = dm === 3 && ((i * 7 + j * 5) % 6 === 0) && !((i < BOUNDS.minI || i > BOUNDS.maxI) && (j < BOUNDS.minJ || j > BOUNDS.maxJ));
      const h = wf ? F : F * (dm === 3 ? R(0.45, 0.7) : R(0.85, 1.25));
      if (wf) {
        const th = j < BOUNDS.minJ ? 0 : j > BOUNDS.maxJ ? Math.PI : i < BOUNDS.minI ? Math.PI / 2 : -Math.PI / 2;
        put('cliff_waterfall_rock', x, 0, z, th, F);
      } else put('cliff_block_rock', x, 0, z, 0, F, h, F);
      put('nr_grass', x, h, z, 0, F);
      for (let t = 0; t < 3; t++) P(pick(['tree_pineTallA', 'tree_pineTallD', 'tree_pineSmallA', 'tree_oak', 'tree_tall_fall']), x + R(-0.35, 0.35) * F, z + R(-0.35, 0.35) * F, R(8, 13), h);
      continue;
    }
    put('nr_grass', x, 0, z, 0, F);
    if (feat.has(i + ',' + j)) { feat.get(i + ',' + j)(x, z); continue; }
    const near = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].some(([a2, b2]) => occ.has((i + a2) + ',' + (j + b2)));
    const cnt = near ? 2 : 4, lim = near ? 0.3 : 0.4;
    for (let t = 0; t < cnt; t++) {
      const px = x + R(-lim, lim) * F, pz = z + R(-lim, lim) * F, r = prnd();
      if (r < 0.35) P(pick(prnd() < 0.4 ? FALL : GREEN), px, pz, R(7, 11));
      else if (r < 0.5) P(pick(['plant_bush', 'plant_bushLarge', 'plant_bushLargeTriangle']), px, pz, R(5, 8));
      else if (r < 0.7) P(pick(['flower_redA', 'flower_yellowA', 'flower_purpleA']), px, pz, R(6, 9));
      else if (r < 0.82) P(pick(['rock_largeA', 'rock_largeC', 'stone_largeA']), px, pz, R(2.2, 3.6));
      else P(pick(['stump_old', 'log_large', 'mushroom_redTall', 'log_stack']), px, pz, R(6, 10));
    }
  }
  // lily pads on the canal
  CELLS.forEach((c, idx) => {
    if (c.corner) return; const [x, z] = cellCenter(c);
    for (let t = 0; t < 2; t++) { const sd = t ? 1 : -1, along = R(-0.3, 0.3) * F, lat = sd * R(0.14, 0.2) * F; P(prnd() < 0.6 ? 'lily_large' : 'lily_small', x + (c.d[1] !== 0 ? lat : along * c.d[0]), z + (c.d[0] !== 0 ? lat : along * c.d[1]), R(11, 15), -0.03 * F); }
  });
  // wooden fence along both banks
  { const step = F * 0.25, fs = step * 1.04, LAT = F * 0.34;
    for (let sd = -1; sd <= 1; sd += 2) for (let d = 0; d < TRACK_LEN; d += step) {
      const p = pointAt(d - START_OFFSET), th = Math.atan2(-p.tz, p.tx);
      const lx = p.x - p.tz * sd * LAT, lz = p.z + p.tx * sd * LAT;
      const off = 0.465 * fs; // fence line sits at local z -0.465
      put('fence_simple', lx + Math.sin(th) * off, 0, lz + Math.cos(th) * off, th, fs, fs * 0.75, fs);
    } }
  if (blobs.length) {
    const geos = blobs.map(([bx, by, bz, br]) => { const g = new THREE.CircleGeometry(br * 1.5, 14); g.rotateX(-Math.PI / 2); g.translate(bx, by, bz); return g; });
    const bm = new THREE.Mesh(mergeGeometries(geos, false), new THREE.MeshBasicMaterial({ color: '#0b3a40', transparent: true, opacity: 0.28, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    bm.frustumCulled = false; bm.renderOrder = 1; group.add(bm);
  }
  // start gate, buoys and a few moored ships
  const p0 = pointAt(0), n0 = { x: -p0.tz, z: p0.tx };
  put('b_gate_finish', p0.x, 0, p0.z, Math.atan2(-n0.z, n0.x), F * 0.2);
  CELLS.forEach((c, idx) => {
    if (c.corner || idx % 2) return; const [x, z] = cellCenter(c);
    for (const sd of [-1, 1]) put(idx % 4 ? 'b_buoy' : 'b_buoy_flag', x + (c.d[1] !== 0 ? sd * F * 0.24 : 0), 0, z + (c.d[0] !== 0 ? sd * F * 0.24 : 0), 0, 1.7);
  });
  for (const nm of Object.keys(B)) {
    const model = models[nm]; if (!model || !B[nm].length) continue;
    model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      let top = o; while (top.parent && top.parent !== model.scene) top = top.parent;
      const rel = top.matrixWorld.clone().invert().multiply(o.matrixWorld);
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(rel)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), spaceMat(o.material, false)); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}
const clampI = (i) => Math.max(BOUNDS.minI, Math.min(BOUNDS.maxI, i));
const clampJ = (j) => Math.max(BOUNDS.minJ, Math.min(BOUNDS.maxJ, j));

function buildRaceWorld() {
  if (worldGroup) { worldGroup.traverse((o) => { if (o.isMesh && o.geometry) o.geometry.dispose(); }); raceScene.remove(worldGroup); }
  worldGroup = new THREE.Group(); raceScene.add(worldGroup);
  const biome = MAP.biome;
  applyAtmosphere();
  renderer.toneMapping = MAP.style === 'river' ? THREE.NeutralToneMapping : THREE.ACESFilmicToneMapping;
  hemi.intensity = MAP.style === 'river' ? 0.85 : hemi.intensity;

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: BIOMES[MAP.style === 'space' ? 'space' : MAP.style === 'river' ? 'river' : biome].ground }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.06; ground.receiveShadow = true; worldGroup.add(ground);

  ROAD_Y = 0;
  if (MAP.kind === 'gp') { buildGP(worldGroup); buildWeather(); builtKey = MAP.id + '|' + WX; return; }
  if (MAP.kind === 'c2') { buildC2(worldGroup); buildWeather(); builtKey = MAP.id + '|' + WX; return; }
  if (MAP.style === 'river') { buildRiver(worldGroup); buildWeather(); builtKey = MAP.id + '|' + WX; return; }
  if (biome === 'city') {
    const occ0 = new Set(CELLS.map((c) => c.i + ',' + c.j));
    buildCity(worldGroup, occ0, mulberry(33)); buildWeather(); builtKey = MAP.id + '|' + WX; return;
  }
  const straight = [], finish = [], corner = [[], [], [], []], forest = [], empty = [], tents = [], props = [], natBuckets = {};
  const occ = new Set();
  CELLS.forEach((c, idx) => {
    occ.add(c.i + ',' + c.j);
    const [x, z] = cellCenter(c);
    if (c.corner) corner[c.k].push({ x, z, rot: c.k * Math.PI / 2 });
    else if (idx === 0) finish.push({ x, z, rot: c.d[0] !== 0 ? Math.PI / 2 : 0 });
    else straight.push({ x, z, rot: c.d[0] !== 0 ? Math.PI / 2 : 0 });
  });
  const rnd = mulberry(7), prnd = mulberry(21);
  const cx0 = (BOUNDS.minI + BOUNDS.maxI) / 2, cz0 = (BOUNDS.minJ + BOUNDS.maxJ) / 2;
  for (let i = BOUNDS.minI - 4; i <= BOUNDS.maxI + 4; i++) for (let j = BOUNDS.minJ - 4; j <= BOUNDS.maxJ + 4; j++) {
    if (occ.has(i + ',' + j)) continue;
    const x = (i - cx0) * TILE, z = (j - cz0) * TILE;
    const r = rnd(); const rot = Math.floor(rnd() * 4) * Math.PI / 2;
    const nearRoad = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].some(([a, b]) => occ.has((i + a) + ',' + (j + b)));
    const scatter = (n) => { for (let q = 0; q < n; q++) { const px = x + (prnd() - 0.5) * 7, pz = z + (prnd() - 0.5) * 7; scatterProp(px, pz); } };
    const nat = (name, px, pz, s0, s1) => { (natBuckets[name] = natBuckets[name] || []).push({ x: px, z: pz, rot: prnd() * 6.28, s: s0 + prnd() * (s1 - s0) }); };
    const scatterProp = (px, pz) => {
      const q = prnd();
      if (biome === 'desert') {
        if (q < 0.22) nat('cactus_tall', px, pz, 4.5, 7); else if (q < 0.38) nat('cactus_short', px, pz, 4.5, 7);
        else if (q < 0.52) nat(['tree_palmTall', 'tree_palm'][Math.floor(prnd() * 2)], px, pz, 4.5, 6.5);
        else if (q < 0.7) nat(['rock_largeA', 'rock_largeC', 'stone_largeA'][Math.floor(prnd() * 3)], px, pz, 3.5, 6);
        else if (q < 0.82) nat(['rock_tallA', 'rock_tallC', 'stone_tallB'][Math.floor(prnd() * 3)], px, pz, 4, 6.5);
        else nat('stone_smallA', px, pz, 4, 7);
      } else if (biome === 'snow') {
        if (q < 0.4) nat(['tree_pineTallA', 'tree_pineTallC_detailed', 'tree_pineDefaultA', 'tree_pineRoundC'][Math.floor(prnd() * 4)], px, pz, 5, 8);
        else if (q < 0.55) nat(['stone_largeA', 'rock_largeA'][Math.floor(prnd() * 2)], px, pz, 3.5, 6);
        else if (q < 0.65) nat('plant_bushLarge', px, pz, 4, 6);
        else if (q < 0.82) { const s = 0.9 + prnd() * 1.3; props.push({ geo: G.sph, x: px, y: 0, z: pz, sx: s * 1.6, sy: s * 0.7, sz: s * 1.4, color: '#f7fbff' }); }
        else snowman(props, px, pz, prnd);
      } else {
        if (q < 0.2) nat(['tree_oak', 'tree_default'][Math.floor(prnd() * 2)], px, pz, 4.5, 6.5);
        else if (q < 0.4) nat(['plant_bush', 'plant_bushLarge'][Math.floor(prnd() * 2)], px, pz, 4, 6);
        else if (q < 0.55) nat(['flower_redA', 'flower_yellowA', 'flower_purpleA'][Math.floor(prnd() * 3)], px, pz, 5, 7);
        else if (q < 0.7) nat(['rock_largeA', 'rock_largeC', 'stone_largeA'][Math.floor(prnd() * 3)], px, pz, 3, 5);
        else if (q < 0.8) nat(['stump_old', 'log_large'][Math.floor(prnd() * 2)], px, pz, 4, 6);
        else nat('tree_pineSmallA', px, pz, 5, 7);
      }
    };
    if (biome === 'forest') {
      if (nearRoad) { if (r < 0.3) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); scatter(2); } } else if (r < 0.55) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); scatter(3); }
    } else if (biome === 'desert') {
      if (nearRoad) { if (r < 0.55) scatter(1 + Math.floor(prnd() * 2)); } else if (r < 0.75) scatter(2 + Math.floor(prnd() * 2)); else if (r < 0.9) props.push({ geo: G.dune, x, y: -0.9, z, sx: 6, sy: 1.5, sz: 6, color: '#dfbf80' });
    } else {
      if (nearRoad) { if (r < 0.35) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); if (r < 0.6) scatter(1); } }
      else if (r < 0.4) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); if (r < 0.85) scatter(2); }
    }
  }
  const add = (tpl, pl) => { if (pl.length) worldGroup.add(mergePlacements(tpl.scene, pl, biome)); };
  add(models.straight, straight); add(models.finish, finish);
  for (let k = 0; k < 4; k++) add(models.corner, corner[k]);
  add(models.forest, forest); add(models.empty, empty);
  if (props.length) worldGroup.add(propsMesh(props));
  for (const nm of Object.keys(natBuckets)) worldGroup.add(mergeNature(models[nm], natBuckets[nm], biome));
  buildWeather();
  builtKey = MAP.id + '|' + WX;
}

let garagePlinth = null, garageLights = null, garageThemeKey = '', garageThemeGroup = null, garageTurn = null, garageDust = null, garageT = 0, garagePop = 0, garageIdle = 0, garageDrag = false;
function wallTexture(door) {
  const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 512; const c = cv.getContext('2d');
  c.fillStyle = '#2a2252'; c.fillRect(0, 0, 2048, 512);
  c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 3;
  for (let x = 0; x <= 2048; x += 128) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 512); c.stroke(); }
  for (let y = 128; y < 512; y += 128) { c.beginPath(); c.moveTo(0, y); c.lineTo(2048, y); c.stroke(); }
  c.fillStyle = '#1b1640'; c.fillRect(0, 400, 2048, 112);
  for (let x = -60; x < 2048; x += 64) { c.fillStyle = (Math.floor(x / 64) % 2) ? '#f5c431' : '#15112b'; c.beginPath(); c.moveTo(x, 496); c.lineTo(x + 32, 496); c.lineTo(x + 20, 512); c.lineTo(x - 12, 512); c.fill(); }
  if (door) {
    c.fillStyle = '#3a3070'; c.fillRect(744, 120, 560, 392);
    for (let y = 120; y < 512; y += 22) { c.fillStyle = 'rgba(0,0,0,0.28)'; c.fillRect(744, y + 17, 560, 4); c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(744, y, 560, 2); }
    c.fillStyle = '#15112b'; c.fillRect(744, 112, 560, 10);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function glowTexture(col) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const c = cv.getContext('2d');
  const g = c.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, col); g.addColorStop(0.45, col.replace(/[\d.]+\)$/, '0.18)')); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
  c.fillStyle = g; c.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function buildGarageWorld() {
  const sc = garageScene;
  sc.background = null;
  sc.fog = new THREE.Fog('#120e26', 16, 38);
  const gHemi = new THREE.HemisphereLight('#c9c4ff', '#3a3270', 1.4); sc.add(gHemi);
  const key = new THREE.SpotLight('#fff0d8', 900, 45, 0.5, 0.7, 2); key.position.set(-3.5, 9.5, 5); key.target.position.set(0, 0.4, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.camera.near = 4; key.shadow.camera.far = 30;
  sc.add(key, key.target);
  const fill = new THREE.DirectionalLight('#dcd6ff', 0.7); fill.position.set(7, 3, 8); sc.add(fill);
  const rimC = new THREE.SpotLight('#3fd8e8', 650, 40, 0.65, 0.8, 2); rimC.position.set(6.5, 5, -6); rimC.target.position.set(0, 0.6, 0); sc.add(rimC, rimC.target);
  const rimO = new THREE.SpotLight('#ff8a3d', 650, 40, 0.65, 0.8, 2); rimO.position.set(-7.5, 4.5, -5); rimO.target.position.set(0, 0.6, 0); sc.add(rimO, rimO.target);
  garageLights = { hemi: gHemi, key, fill, rimC, rimO };
  // turntable
  garageTurn = new THREE.Group(); sc.add(garageTurn);
  const PH = 0.8;
  const sideTex = (() => { const cv = document.createElement('canvas'); cv.width = 8; cv.height = 128; const c = cv.getContext('2d'); const g = c.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#a9a9a9'); g.addColorStop(1, '#505050'); c.fillStyle = g; c.fillRect(0, 0, 8, 128); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const sideMat = new THREE.MeshStandardMaterial({ color: '#2a5f9a', map: sideTex, metalness: 0.15, roughness: 0.55 });
  const topMat = new THREE.MeshStandardMaterial({ color: '#8ec8f0', roughness: 0.5, metalness: 0.05 });
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.4, PH, 96, 1), [sideMat, topMat, sideMat]);
  drum.position.y = PH / 2; drum.castShadow = true; drum.receiveShadow = true; garageTurn.add(drum);
  const bandMat = new THREE.MeshBasicMaterial({ color: '#3fd8e8' }), rimMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const band = new THREE.Mesh(new THREE.TorusGeometry(3.36, 0.035, 8, 120), bandMat); band.rotation.x = Math.PI / 2; band.position.y = 0.26; garageTurn.add(band);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.24, 0.045, 8, 120), rimMat); rim.rotation.x = Math.PI / 2; rim.position.y = PH; garageTurn.add(rim);
  // spinning pattern on the top face (wedges + ring) so the rotation reads
  const dcv = document.createElement('canvas'); dcv.width = dcv.height = 512; const dtex = new THREE.CanvasTexture(dcv); dtex.colorSpace = THREE.SRGBColorSpace; dtex.anisotropy = 4;
  const deck = new THREE.Mesh(new THREE.CircleGeometry(3.2, 96), new THREE.MeshStandardMaterial({ map: dtex, transparent: true, roughness: 0.6 }));
  deck.rotation.x = -Math.PI / 2; deck.position.y = PH + 0.004; deck.receiveShadow = true; garageTurn.add(deck);
  const paintDeck = (accent) => {
    const c = dcv.getContext('2d'); c.clearRect(0, 0, 512, 512); c.translate(256, 256);
    for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); c.fillStyle = i % 2 ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 250, -Math.PI / 12, Math.PI / 12); c.closePath(); c.fill(); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.translate(256, 256);
    c.strokeStyle = accent; c.lineWidth = 5; c.globalAlpha = 0.9; c.beginPath(); c.arc(0, 0, 228, 0, 7); c.stroke(); c.lineWidth = 2; c.globalAlpha = 0.6; c.beginPath(); c.arc(0, 0, 205, 0, 7); c.stroke();
    c.globalAlpha = 0.85; c.fillStyle = accent; for (let i = 0; i < 24; i++) { c.rotate(Math.PI / 12); c.fillRect(236, -3, 12, 6); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; dtex.needsUpdate = true;
  };
  garagePlinth = { side: sideMat, top: topMat, band: bandMat, rim: rimMat, paint: paintDeck }; paintDeck('#3fd8e8');
  const step = new THREE.Mesh(new THREE.CylinderGeometry(3.95, 4.05, 0.12, 80), new THREE.MeshStandardMaterial({ color: '#4a4f5a', metalness: 0.2, roughness: 0.7 })); step.position.y = 0.06; step.visible = false; step.receiveShadow = true; sc.add(step);
  const stepEdge = new THREE.Mesh(new THREE.TorusGeometry(3.98, 0.04, 8, 120), (garagePlinth.edge = new THREE.MeshBasicMaterial({ color: '#3fd8e8' }))); stepEdge.rotation.x = Math.PI / 2; stepEdge.position.y = 0.12; stepEdge.visible = false; sc.add(stepEdge);
  // dust motes in the light
  const N = 160, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 14; pos[i * 3 + 1] = 0.3 + Math.random() * 6.5; pos[i * 3 + 2] = (Math.random() - 0.5) * 12; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  garageDust = new THREE.Points(dg, new THREE.PointsMaterial({ map: glowTexture('rgba(255,255,255,1)'), size: 0.12, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  garageDust.frustumCulled = false; sc.add(garageDust);
}


/* ------------------------------------------------------------------ garage dioramas: the ride sits on its plinth inside the selected track's world */
const gtKey = (m) => 'garage' || (m.style === 'space' ? 'rust' : m.style === 'river' ? 'bay' : m.kind === 'gp' ? 'gp' : m.kind === 'c2' ? 'skyway' : m.biome);
function kitClone(name, x, y, z, rot, s, fix) {
  const o = models[name].scene.clone(true);
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (fix) m.material = fix(m.material); } });
  const g = new THREE.Group(); g.add(o); g.position.set(x, y || 0, z); g.rotation.y = rot || 0; g.scale.setScalar((s || 1) * (fix && fix.nat ? 0.55 : 1)); return g;
}
/* place a kit piece so its footprint is w wide and it stands on the ground at (x, z) */
function kitFit(name, x, z, rot, w, fix, y0) {
  const o = models[name].scene.clone(true);
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (fix) m.material = fix(m.material); } });
  const g = new THREE.Group(); g.add(o); g.updateWorldMatrix(true, true);
  const b = new THREE.Box3().setFromObject(g), sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  const k = w / Math.max(sz.x, sz.z); o.scale.setScalar(k); o.position.set(-c.x * k, -b.min.y * k, -c.z * k);
  const wrap = new THREE.Group(); wrap.add(g); wrap.position.set(x, y0 || 0, z); wrap.rotation.y = rot || 0; return wrap;
}

/* a cramped, messy American car shop: low ceiling, tools, tyres, drums, oil stains */
function buildPlainGarage() {
  const group = new THREE.Group(), R = mulberry(4242);
  const std = (c, rough, met) => new THREE.MeshStandardMaterial({ color: c, roughness: rough == null ? 0.9 : rough, metalness: met || 0 });
  const box = (w, h, d, x, y, z, mat, cast, ry) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); if (ry) o.rotation.y = ry; o.receiveShadow = true; o.castShadow = !!cast; group.add(o); return o; };
  const cyl = (rt, rb, h, x, y, z, mat, seg) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 20), mat); c.position.set(x, y, z); c.castShadow = true; c.receiveShadow = true; group.add(c); return c; };
  const BW = -8.2, LW = -10.5, RW = 11.5, CH = 7.6;   // back wall z, left wall x, right wall x, ceiling height
  // concrete floor + stains
  box(40, 0.2, 40, 0, -0.1, -8, std('#7d8088', 0.9));
  for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.CircleGeometry(0.5 + R() * 1.1, 20), new THREE.MeshBasicMaterial({ color: '#1b1c20', transparent: true, opacity: 0.18 + R() * 0.25, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.set(-7 + R() * 17, 0.012, -7.5 + R() * 11); s.scale.set(1 + R(), 1, 1); group.add(s); }
  const paint = std('#e9c63a', 0.8);
  box(9.2, 0.02, 0.12, 0.7, 0.011, BW + 2.2, paint); box(0.12, 0.02, 6, -3.9, 0.011, BW + 5, paint);
  // walls (corrugated feel via ribs) and low ceiling
  const wall = std('#b9bcc2', 0.95), wood = std('#6b4f33', 0.9), dark = std('#2b2f3a', 0.7, 0.3);
  box(40, 12, 0.4, 0, 6, BW, wall); box(0.4, 12, 40, LW, 6, -6, wall); box(0.4, 12, 40, RW, 6, -6, wall);
  for (let i = -6; i <= 8; i++) box(0.12, CH, 0.1, i * 1.5 + 1, CH / 2, BW + 0.25, std('#a4a8af', 0.9));
  const ceil = box(40, 0.3, 40, 0, CH + 0.15, -6, std('#45484f', 0.95)); ceil.receiveShadow = false;
  for (let i = -2; i <= 3; i++) box(0.35, 0.5, 30, i * 3.6, CH - 0.2, -6, std('#3a3d44', 0.8));
  for (const x of [-3, 4]) { const l = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: '#fffbe6' })); l.position.set(x, CH - 0.5, -2.5); group.add(l); }
  // roll-up door
  const dW = 8.4, dH = 5.6, dX = 3.2;
  box(dW + 0.7, dH + 0.4, 0.3, dX, (dH + 0.4) / 2, BW + 0.35, dark);
  for (let i = 0; i < 10; i++) box(dW, dH / 10 - 0.07, 0.2, dX, 0.3 + i * (dH / 10), BW + 0.5, std('#d8dbe0', 0.5, 0.15));
  box(1.0, 0.16, 0.25, dX, 0.9, BW + 0.7, dark);
  // neon-ish sign above the door
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; const cx = cv.getContext('2d'); cx.fillStyle = '#16181f'; cx.fillRect(0, 0, 512, 128);
  cx.strokeStyle = '#ff5a4a'; cx.lineWidth = 6; cx.strokeRect(8, 8, 496, 112); cx.fillStyle = '#ffd24a'; cx.font = '900 62px Impact, Arial Black, sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.shadowColor = '#ffb000'; cx.shadowBlur = 18; cx.fillText('AUTO REPAIR', 256, 68);
  const st = new THREE.CanvasTexture(cv); st.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1), new THREE.MeshBasicMaterial({ map: st })); sign.position.set(dX, dH + 0.95, BW + 0.45); group.add(sign);
  // pegboard of tools (back wall, left)
  const pbX = -5.2, pbY = 3.5;
  box(5.4, 3.4, 0.12, pbX, pbY, BW + 0.3, std('#c8a46c', 0.95));
  const toolCols = ['#cfd3d9', '#b8332a', '#2f6fb5', '#e9c63a', '#2b2f3a'];
  for (let i = 0; i < 18; i++) { const tx = pbX - 2.3 + (i % 9) * 0.58, ty = pbY + (i < 9 ? 0.8 : -0.5); box(0.1 + R() * 0.08, 0.7 + R() * 0.7, 0.1, tx, ty, BW + 0.42, std(toolCols[i % 5], 0.4, 0.5)); if (i % 3 === 0) box(0.3, 0.14, 0.1, tx, ty + 0.4, BW + 0.42, std('#2b2f3a', 0.6, 0.3)); }
  // workbench under it, with clutter
  box(5.6, 0.2, 1.8, pbX, 1.45, BW + 1.1, wood, true);
  box(5.4, 1.35, 1.6, pbX, 0.7, BW + 1.1, std('#7a2a22', 0.7, 0.2), true);
  for (let i = 0; i < 3; i++) box(1.6, 0.04, 0.04, pbX - 1.8 + i * 1.8, 1.0, BW + 1.92, std('#2b2f3a'));
  box(0.5, 0.45, 0.5, pbX - 2.1, 1.8, BW + 1.0, dark, true); box(0.7, 0.4, 0.5, pbX - 0.7, 1.75, BW + 1.2, std('#b8332a', 0.5, 0.3), true, 0.3);
  cyl(0.14, 0.14, 0.4, pbX + 0.6, 1.75, BW + 1.0, std('#e9c63a', 0.5, 0.2)); cyl(0.1, 0.1, 0.3, pbX + 1.0, 1.7, BW + 1.3, std('#2f6fb5', 0.5, 0.2)); box(0.5, 0.1, 0.3, pbX + 1.8, 1.6, BW + 1.2, std('#cfd3d9', 0.4, 0.6), false, 0.7);
  // engine block on a stand + rolling toolbox + floor jack
  box(1.0, 0.8, 0.8, -8.2, 1.05, -3.8, std('#5a5f6b', 0.5, 0.6), true, 0.4); cyl(0.4, 0.4, 0.7, -8.2, 1.9, -3.8, std('#8e939c', 0.4, 0.6), 12); box(1.3, 0.6, 1.0, -8.2, 0.3, -3.8, std('#c0392b', 0.6, 0.2), true, 0.4);
  box(1.6, 2.2, 1.0, -9.6, 1.1, -6.2, std('#b8332a', 0.5, 0.3), true, 0.15); for (let i = 0; i < 5; i++) box(1.5, 0.05, 0.05, -9.5, 0.4 + i * 0.4, -5.68, dark, false, 0.15);
  box(1.8, 0.28, 0.5, -3.2, 0.3, -6.9, std('#d3382d', 0.5, 0.3), true, 0.5); cyl(0.12, 0.12, 0.9, -3.0, 0.6, -6.8, std('#8e939c', 0.4, 0.6));
  // tyres: a stack, a leaning one, scattered ones
  const tire = std('#33353d', 0.9), hub = std('#a8adb6', 0.4, 0.7);
  const tyre = (x, y, z, ry, rx) => { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.3, 14, 28), tire); t.castShadow = true; g.add(t); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 14), hub); h.rotation.x = Math.PI / 2; g.add(h); g.position.set(x, y, z); g.rotation.set(rx, ry, 0); group.add(g); };
  for (let i = 0; i < 4; i++) tyre(-9.2 + R() * 0.2, 0.3 + i * 0.6, -3 - 0, 0, Math.PI / 2);
  tyre(6.4, 0.95, BW + 0.55, 0, 0.18); tyre(5.2, 0.3, -6.9, 0.8, Math.PI / 2); tyre(-1.2, 0.3, -7.3, 0, Math.PI / 2); tyre(-1.1, 0.9, -7.2, 0.3, Math.PI / 2);
  // drums, cans, boxes, compressor
  const dr = [['#2f6fb5', 9.9, -7.4], ['#b8332a', 10.7, -6.3], ['#3b8f6a', 10.5, -4.8], ['#2b2f3a', 9.2, -7.7]];
  dr.forEach(([c, x, z], i) => { const d = cyl(0.55, 0.55, 1.5, x, 0.75, z, std(c, 0.5, 0.4)); if (i === 2) { d.rotation.z = 1.4; d.position.y = 0.55; } });
  for (let i = 0; i < 6; i++) cyl(0.12, 0.12, 0.3, -2 + R() * 9, 0.15, -7.2 + R() * 1.2, std(i % 2 ? '#e9c63a' : '#b8332a', 0.5, 0.3));
  const card = std('#b99361', 0.95);
  box(1.3, 0.9, 1.0, 7.9, 0.45, -7.3, card, true, 0.1); box(1.1, 0.8, 0.9, 7.8, 1.3, -7.2, card, true, -0.2); box(0.9, 0.7, 0.9, 9.0, 0.35, -3.6, card, true, 0.5);
  cyl(0.5, 0.5, 1.5, 8.8, 0.95, -5.6, std('#2f8f5a', 0.5, 0.3)).rotation.z = Math.PI / 2; box(0.1, 1.2, 0.1, 8.1, 0.45, -5.6, dark); box(0.1, 1.2, 0.1, 9.5, 0.45, -5.6, dark);
  // wall bits: fire extinguisher, shelf with parts, clock, hanging cable
  cyl(0.16, 0.16, 0.7, RW - 0.4, 1.9, -2.8, std('#d3382d', 0.4, 0.3)); box(0.1, 0.3, 0.12, RW - 0.4, 2.35, -2.8, dark);
  box(0.6, 0.1, 4.6, RW - 0.4, 3.2, -6.2, wood); box(0.6, 0.1, 4.6, RW - 0.4, 4.9, -6.2, wood);
  for (let i = 0; i < 5; i++) { box(0.5, 0.5 + R() * 0.3, 0.7, RW - 0.4, 3.5, -8 + i * 0.95, std(['#c9a15c', '#2f6fb5', '#b8332a', '#8e939c', '#3b8f6a'][i], 0.7), true, R() * 0.4); }
  for (let i = 0; i < 4; i++) box(0.5, 0.4, 0.8 + R() * 0.3, RW - 0.4, 5.2, -7.5 + i * 1.2, std(i % 2 ? '#d8dbe0' : '#a77b4b', 0.7), true);
  cyl(0.5, 0.5, 0.08, 0.2, 5.8, BW + 0.3, std('#f4f4f4', 0.4)).rotation.x = Math.PI / 2;
  // hanging work light
  cyl(0.02, 0.02, 1.6, LW + 2.5, CH - 0.8, -4.8, dark, 6); cyl(0.25, 0.1, 0.3, LW + 2.5, CH - 1.7, -4.8, std('#e9c63a', 0.5, 0.3)); 
  return group;
}
/* prototype: asset-built pit garage (GP kit) with a cluttered car-shop feel */
function buildAssetGarage() {
  const group = new THREE.Group(), R = mulberry(99);
  const fit = (nm, x, z, rot, w, y0) => { if (models[nm]) group.add(kitFit(nm, x, z, rot, w, null, y0)); };
  const clone = (nm, x, y, z, rot, s) => { if (models[nm]) group.add(kitClone(nm, x, y, z, rot, s)); };
  const floor = new THREE.Mesh(new THREE.BoxGeometry(60, 0.2, 60), new THREE.MeshStandardMaterial({ color: '#7e8189', roughness: 0.92 })); floor.position.set(0, -0.1, -10); floor.receiveShadow = true; group.add(floor);
  for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.CircleGeometry(0.5 + R() * 1.0, 20), new THREE.MeshBasicMaterial({ color: '#17181c', transparent: true, opacity: 0.16 + R() * 0.22, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.set(-7 + R() * 14, 0.012, -6 + R() * 9); s.scale.set(1 + R(), 1, 1); group.add(s); }
  // shell: pit garages across the back, closed bay left, office right
  fit('gp_pitsGarage', -7, -10.5, 0, 9.5); fit('gp_pitsGarageClosed', 2.5, -10.5, 0, 9.5); fit('gp_pitsOffice', 12, -10.5, 0, 9.5);
  fit('gp_pitsGarageClosed', -12.5, -4, Math.PI / 2, 9.5); fit('gp_pitsGarage', -12.5, -13.5, Math.PI / 2, 9.5);
  // clutter: tyre stacks, crates, cones, barrels, tank, dumpster, parked race cars, lights, flags
  for (let i = 0; i < 4; i++) clone('k_wheel_dark', -8.6, 0.0 + i * 0.34, -6.4, 0, 2.1);
  for (let i = 0; i < 3; i++) clone('k_wheel_dark', -7.3 + i * 0.1, i * 0.34, -7.4 - i * 0.1, i, 2.1);
  clone('k_wheel_default', 5.6, 0.1, -7.6, 0.6, 2.1); clone('k_wheel_default', 6.5, 0.1, -7.0, 1.8, 2.1); clone('k_wheel_dark', -2.6, 0.1, -7.8, 0.2, 2.1);
  for (const [x, z, r] of [[-5.6, -8.0, 0.2], [-4.6, -8.2, -0.3], [4.6, -8.1, 0.5], [8.4, -6.0, 0.1], [-9.6, -3.2, 0.4]]) clone('k_box', x, 0, z, r, 2.1);
  clone('k_box', -5.4, 0.68, -8.0, 0.8, 2.0); clone('k_box', 8.4, 0.68, -6.0, 0.3, 2.0);
  for (const [x, z] of [[-5.6, -4.6], [6.0, -5.0], [-1.0, -7.0], [8.0, -2.0], [-7.2, -1.0]]) clone('k_cone', x, 0, z, R() * 6, 1.9);
  fit('s_barrels', 9.6, -7.3, 0.3, 2.1); fit('s_barrels', -10, 0.5, 1.2, 2.0); fit('i_detail_tank_large', 10.5, -4, 0, 3.6); fit('c_dumpster', 8.2, -8, 0.15, 2.0);
  fit('gp_raceCarRed', 7.6, -3.4, -0.7, 3.4); fit('gp_raceCarWhite', -7.6, -4.4, 0.6, 3.4);
  fit('gp_lightPostModern', -9, -8, 0, 2.2); fit('gp_lightPostLarge', 8.6, -9.2, 0, 2.4); fit('gp_flagCheckers', 0.5, -9.2, 0, 2.0); fit('gp_billboardLow', 2.8, -9, 0, 6.5);
  fit('c_construction_barrier', 4.2, -6.8, 0.2, 2.2); fit('c_light_curved', -10.5, -6, Math.PI / 2, 2.6);
  return group;
}
function buildGarageTheme(key) {
  if (key === 'garage') { const g = new THREE.Group(); const fl = new THREE.Mesh(new THREE.CircleGeometry(70, 64), new THREE.MeshStandardMaterial({ color: '#201d2c', roughness: 0.55, metalness: 0.1 })); fl.rotation.x = -Math.PI / 2; fl.position.y = -0.02; fl.receiveShadow = true; g.add(fl); return { group: g, B: {}, key }; }
  const group = new THREE.Group(), R = mulberry(key.length * 977 + 13), TAU = Math.PI * 2;
  const B = BIOMES[key === 'rust' ? 'space' : key === 'bay' ? 'river' : key === 'skyway' ? 'city' : key === 'gp' ? 'forest' : key];
  const biome = key === 'desert' ? 'desert' : key === 'snow' ? 'snow' : 'forest';
  const gm = new THREE.Mesh(new THREE.CircleGeometry(90, 64), new THREE.MeshStandardMaterial({ color: B.ground, roughness: key === 'bay' ? 0.2 : 0.95, metalness: key === 'bay' ? 0.2 : 0 }));
  gm.rotation.x = -Math.PI / 2; gm.receiveShadow = true; group.add(gm);
  const blocked = (x, z) => (z > 0.5 && x > -2.5 && x < 14) || Math.hypot(x, z) < 5.4;
  const nat = {}; const props = [];
  const N = (name, x, z, s) => { (nat[name] = nat[name] || []).push({ x, z, rot: R() * TAU, s: s * 0.55 }); };
  const scatter = (n, r0, r1, fn) => { let k = 0, guard = 0; while (k < n && guard++ < n * 8) { const a = R() * TAU, r = r0 + R() * (r1 - r0), x = Math.cos(a) * r, z = Math.sin(a) * r - 2; if (blocked(x, z)) continue; fn(x, z, r); k++; } };
  const pk = (a) => a[Math.floor(R() * a.length)];
  const natFix = (m) => natMat(m, biome); natFix.nat = true;
  if (key === 'forest') {
    scatter(12, 5.6, 9, (x, z) => N(pk(['flower_redA', 'flower_yellowA', 'flower_purpleA']), x, z, 5 + R() * 2));
    scatter(8, 6, 11, (x, z) => N(pk(['plant_bush', 'plant_bushLarge']), x, z, 4 + R() * 2));
    scatter(6, 7, 14, (x, z) => N(pk(['rock_largeA', 'rock_largeC', 'stone_largeA']), x, z, 3 + R() * 2));
    scatter(14, 10, 20, (x, z) => N(pk(['tree_oak', 'tree_default']), x, z, 5.5 + R() * 2.2));
    scatter(10, 12, 26, (x, z) => N(pk(['tree_pineSmallA', 'tree_pineDefaultA']), x, z, 5.5 + R() * 2));
    scatter(34, 18, 38, (x, z) => N(pk(['tree_oak', 'tree_default', 'tree_pineTallA']), x, z, 7 + R() * 3));
    group.add(kitClone('tent_detailedOpen', -8.5, 0, -5.5, 0.6, 5, natFix), kitClone('campfire_logs', -6.2, 0, -3.8, 0.3, 4, natFix), kitClone('log_stack', -11, 0, -3, 1.2, 5, natFix));
  } else if (key === 'desert') {
    scatter(12, 6, 14, (x, z) => N(pk(['cactus_tall', 'cactus_short']), x, z, 4.5 + R() * 2.4));
    scatter(7, 9, 20, (x, z) => N(pk(['tree_palmTall', 'tree_palm']), x, z, 5 + R() * 2));
    scatter(10, 6.5, 16, (x, z) => N(pk(['rock_largeA', 'rock_largeC', 'stone_largeA', 'stone_smallA']), x, z, 3.5 + R() * 2.5));
    scatter(10, 16, 34, (x, z) => N(pk(['rock_tallA', 'rock_tallC', 'stone_tallB']), x, z, 6 + R() * 5));
    scatter(14, 14, 44, (x, z) => props.push({ geo: G.dune, x, y: -0.6, z, sx: 4 + R() * 6, sy: 1 + R() * 1.4, sz: 4 + R() * 6, color: '#dfbf80' }));
    group.add(kitClone('statue_obelisk', -3, 0, -16, 0, 9, natFix));
  } else if (key === 'snow') {
    scatter(22, 9, 30, (x, z) => N(pk(['tree_pineTallA', 'tree_pineTallC_detailed', 'tree_pineDefaultA', 'tree_pineRoundC']), x, z, 6 + R() * 3));
    scatter(8, 6.5, 16, (x, z) => N(pk(['stone_largeA', 'rock_largeA']), x, z, 3 + R() * 2.5));
    scatter(5, 7, 14, (x, z) => N('plant_bushLarge', x, z, 4 + R() * 2));
    scatter(14, 6, 30, (x, z) => { const s = 0.9 + R() * 1.6; props.push({ geo: G.sph, x, y: 0, z, sx: s * 1.8, sy: s * 0.7, sz: s * 1.5, color: '#f7fbff' }); });
    scatter(5, 6.5, 14, (x, z) => snowman(props, x, z, R));
    scatter(30, 24, 48, (x, z) => N(pk(['tree_pineTallA', 'tree_pineTallC_detailed']), x, z, 8 + R() * 3));
  } else if (key === 'city' || key === 'skyway') {
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) group.add(kitClone('c_road_straight', i * 10, 0.0, j * 10, 0, 10));
    const bw = (nm, x, z, w, rot) => group.add(kitFit(nm, x, z, rot, w));
    const row = key === 'skyway' ? ['m_building_skyscraper_a', 'm_building_skyscraper_c', 'm_building_skyscraper_d', 'm_building_skyscraper_e'] : ['m_building_a', 'm_building_b', 'm_building_d', 'm_building_f', 'm_building_g', 'm_building_h', 'm_building_i', 'm_building_l', 'm_building_m'];
    for (let x = -46; x <= 46; x += 11) bw(pk(row), x + R() * 2, -36 - R() * 4, 8 + R() * 2, 0);
    for (let x = -44; x <= 44; x += 14) bw(pk(['m_building_skyscraper_a', 'm_building_skyscraper_c', 'm_building_skyscraper_d', 'm_building_skyscraper_e']), x + R() * 3, -58, 12 + R() * 3, 0);
    for (let z = -20; z <= -4; z += 8) { bw(pk(row), -34 - R() * 3, z, 8 + R() * 2, Math.PI / 2); bw(pk(row), 36 + R() * 3, z - 4, 8 + R() * 2, -Math.PI / 2); }
    group.add(kitClone('c_light_curved_double', -8, 0, -6, 0, 10), kitClone('c_light_square_double', 9, 0, -9, Math.PI, 10));
    for (let k = 0; k < 7; k++) { const a = -0.4 + k * 0.55; group.add(kitClone('c_construction_cone', Math.cos(a) * -6.2 - 1, 0, Math.sin(a + 1.9) * -6.2 + 1 - 1.5, R() * 6, 10)); }
    group.add(kitClone('c_construction_barrier', 8.5, 0, -3.2, 0.3, 10), kitClone('c_dumpster', -10.5, 0, -4, 0.5, 10));
    if (key === 'skyway') { group.add(kitClone('c_road_bridge', 0, 6, -13, 0, 10), kitClone('c_bridge_pillar', -9, 0, -13, 0, 10), kitClone('c_bridge_pillar', 9, 0, -13, 0, 10), kitClone('c_sign_highway_wide', 15, 0, -6, -0.4, 10)); }
  } else if (key === 'rust') {
    const sf = (m) => spaceMat(m, false);
    group.add(kitFit('s_hangar_largeA', -12, -13, 0.2, 15, sf), kitFit('s_hangar_roundA', 14, -17, 0.5, 13, sf), kitClone('s_satelliteDish_large', 9, 0, -9, 2.3, 5.5, sf), kitFit('s_hangar_smallA', -22, -4, 1.4, 9, sf));
    const S = 3.2; group.add(kitClone('s_rocket_baseA', -4, 0, -17, 0, S, sf), kitClone('s_rocket_sidesA', -4, 1.6 * S, -17, 0, S, sf), kitClone('s_rocket_topA', -4, 2.6 * S, -17, 0, S, sf));
    group.add(kitClone('s_rover', 7.5, 0, -1.5, 0.6, 4.2, sf), kitClone('s_astronautA', -8.2, 0, -3.5, 0.9, 3, sf), kitClone('s_barrels', 11.5, 0, -4.5, 0.2, 4, sf), kitClone('s_machine_generatorLarge', -17, 0, -8, 0.6, 3, sf));
    scatter(16, 6.5, 30, (x, z) => group.add(kitClone(pk(['s_rock_largeA', 's_rock_largeB', 's_rocks_smallA', 's_rocks_smallB', 's_rock_crystalsLargeA', 's_rock_crystalsLargeB']), x, 0, z, R() * 6.3, 5 + R() * 4, sf)));
    scatter(7, 8, 30, (x, z) => group.add(kitClone(pk(['s_crater', 's_craterLarge']), x, 0.03, z, R() * 6.3, 7 + R() * 3, sf)));
  } else if (key === 'bay') {
    const dock = new THREE.Mesh(new THREE.CylinderGeometry(4.9, 5.0, 0.2, 48), new THREE.MeshStandardMaterial({ color: '#a77b4b', roughness: 0.9 })); dock.position.y = 0.0; dock.receiveShadow = true; dock.castShadow = true; group.add(dock);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, p = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 1.2, 8), new THREE.MeshStandardMaterial({ color: '#6d4c2d', roughness: 1 })); p.position.set(Math.cos(a) * 4.95, -0.1, Math.sin(a) * 4.95); group.add(p); }
    group.add(kitClone('canoe', -6.8, -0.1, 2.2, 0.7, 5, natFix), kitFit('b_boat_house_a', -12, -12, 0.3, 12), kitFit('b_boat_speed_d', 8.5, -5.5, -0.5, 6), kitFit('b_boat_fishing_small', -3, -11, 1.6, 6));
    for (let k = 0; k < 7; k++) group.add(kitFit(k % 2 ? 'b_buoy' : 'b_buoy_flag', 6 + R() * 14 - 7 + (k - 3) * 2, -3 - R() * 12, R() * 6, 1.4));
    scatter(8, 7, 20, (x, z) => N(pk(['lily_large', 'lily_small']), x, z, 5 + R() * 2));
    for (const [ix, iz] of [[-16, -6], [14, -12], [-3, -22], [22, -2]]) { const isl = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 0.5, 20), new THREE.MeshStandardMaterial({ color: '#e8d79c', roughness: 1 })); isl.position.set(ix, 0.05, iz); isl.receiveShadow = true; group.add(isl); N('tree_palmTall', ix + 0.5, iz, 6 + R()); N('tree_palm', ix - 1.5, iz + 1, 5.5); N('rock_largeA', ix + 2, iz - 1, 3); }
  } else if (key === 'gp') {
    const rd = new THREE.Mesh(new THREE.CircleGeometry(30, 48), new THREE.MeshStandardMaterial({ color: '#4d5160', roughness: 0.9 })); rd.rotation.x = -Math.PI / 2; rd.position.y = 0.01; rd.receiveShadow = true; group.add(rd);
    const ln = new THREE.Mesh(new THREE.RingGeometry(14.8, 15, 64), new THREE.MeshBasicMaterial({ color: '#ffffff' })); ln.rotation.x = -Math.PI / 2; ln.position.y = 0.02; group.add(ln);
    group.add(kitFit('gp_grandStand', 0, -30, 0, 22), kitFit('gp_grandStandCovered', -32, -14, 0.6, 14), kitFit('gp_pitsGarage', 30, -12, -1.2, 12), kitFit('gp_billboard', -17, -8, 0.3, 8), kitFit('gp_bannerTowerRed', 13, -12, 0, 4), kitFit('gp_bannerTowerGreen', -13, -12, 0, 4));
    group.add(kitFit('gp_raceCarRed', 9, -2.5, 0.8, 4.2), kitFit('gp_raceCarWhite', -7.5, -3.5, -0.5, 4.2), kitFit('gp_flagCheckers', 5.5, -9, 0, 3), kitFit('gp_lightPostLarge', -9, -7, 0, 2), kitFit('gp_lightPostModern', 11, -7, 0, 2));
    for (let k = 0; k < 9; k++) { const a = Math.PI + 0.35 + k * 0.28; group.add(kitFit(k % 2 ? 'gp_barrierRed' : 'gp_barrierWhite', Math.cos(a) * 12 - 0.5, Math.sin(a) * 12 - 3, -a + Math.PI / 2, 5)); }
    scatter(12, 26, 44, (x, z) => N(pk(['tree_oak', 'tree_default']), x, z, 7 + R() * 3));
  }
  for (const nm of Object.keys(nat)) group.add(mergeNature(models[nm], nat[nm], biome));
  if (props.length) group.add(propsMesh(props));
  return { group, B, key };
}
function setGarageTheme(map) {
  if (!garageScene || !garageLights) return;
  const key = gtKey(map); if (key === garageThemeKey) return;
  garageThemeKey = key;
  if (garageThemeGroup) { garageScene.remove(garageThemeGroup); garageThemeGroup = null; }
  const th = buildGarageTheme(key); garageThemeGroup = th.group; garageScene.add(th.group);
  const L = garageLights;
  garageScene.background = null; garageScene.fog = new THREE.Fog('#14111c', 16, 46);
  L.hemi.color.set('#ffffff'); L.hemi.groundColor.set('#5a5f6b'); L.hemi.intensity = 1.9;
  if (garagePlinth) { garagePlinth.side.color.set('#2a2f3b'); garagePlinth.top.color.set('#3c4352'); garagePlinth.band.color.set('#4a5266'); garagePlinth.edge.color.set('#14111c'); garagePlinth.rim.color.set('#5c657c'); garagePlinth.paint('#566078'); }
  L.key.color.set('#fff2dc'); L.key.intensity = 2300; L.fill.intensity = 0.5; L.rimC.intensity = 0; L.rimO.intensity = 0;
}

/* ------------------------------------------------------------------ vehicles */
function makeVehicle(ride) {
  const src = models[ride.id].scene.clone(true);
  src.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const wheels = [];
  src.traverse((o) => { if (/wheel/.test(o.name)) wheels.push(o); });
  const g = new THREE.Group(); g.add(src);
  return { group: g, model: src, wheels };
}

/* ------------------------------------------------------------------ game state */
let state = 'loading';
let selectedRide = RIDES[0];
let racers = [];
let player = null;
let raceTime = 0, countdown = 0;
['turbo','triple','nitro','magnet','shield','mirror','autocorrect','ink','torpedo','scramble','fog','hard','easy','freeze','lucky'].forEach((k) => { new Image().src = 'cards/art_' + k + '.webp'; });
const newItems = () => ({ list: [], shieldOn: false, mirrorOn: false, autoOn: false, nitroT: 0, magnetT: 0, freezeT: 0, fogT: 0, tripleN: 0, tripleT: 0 });
let items = newItems();
let cur = null; // typing state
let hudCache = {};
let best = null;
function loadBest() {
  best = null;
  try { best = parseFloat(localStorage.getItem('turbotype-best-' + MAP.id) || (MAP.id === 'forest' ? localStorage.getItem('turbotype-best') : '')) || null; } catch (e) { best = null; }
}
loadBest();

function wpm2speed(wpm) { return (IMPULSE * (wpm * 5 / 60)) / FRICTION; }
const rideMul = (r) => 1 + 0.05 * (r.speed - 3);

function newRacer(def, ride, slot, isPlayer) {
  const v = makeVehicle(ride);
  raceScene.add(v.group);
  const slots = [[-1, 1.8], [-4, -1.8], [-7, 1.8], [-10, -1.8]];
  return {
    name: def.name, color: def.color, ride, isPlayer, v,
    dist: slots[slot][0], lane: slots[slot][1], lat: slots[slot][1], speed: 0, wpm: def.wpm || 0,
    seed: Math.random() * 10, finished: false, finishTime: 0, slowT: 0, noise: 0, noiseT: 0
  };
}

function startRace() {
  showKey("", false, false);
  if (builtKey !== MAP.id + '|' + WX) { buildRaceWorld(); }
  $('raceName').textContent = MAP.name + (WX !== 'clear' ? ' · ' + WEATHERS.find((w) => w.id === WX).name : '');
  for (const r of racers) raceScene.remove(r.v.group);
  racers = [];
  const rivalRides = RIDES.filter((r) => r.id !== selectedRide.id);
  const slotOrder = [1, 0, 2, 3]; // player gets slot 1 (second row)
  const rivalSlots = [0, 1, 2];
  player = newRacer({ name: me().name, color: me().color }, selectedRide, 3, true);
  racers.push(player);
  const botRides = botRideList();
  RIVALS.forEach((rv, n) => { racers.push(newRacer(rv, botRides[n], rivalSlots[n], false)); });
  raceTime = 0; countdown = 3.6;
  items = newItems();
  buildItemBoxes();
  stats = { correct: 0, wrong: 0, times: [] };
  mood = { turboT: 0, stumbleT: 0, boost: 0, streak: 0, scrambleFlash: 0, attackT: 12 + Math.random() * 8, goldGap: 0 };
  initText();
  state = 'countdown'; goT = 0; camInit = false; hudCache = {};
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  el.results.hidden = true; el.panel.style.display = ''; el.race.querySelector('.fit').style.display = '';
  showScreen('race');
  layout();
  renderText(); updateHud(true);
  $('count').hidden = false;
  audioStart();
}

/* ------------------------------------------------------------------ typing */
let stats = { correct: 0, wrong: 0, times: [] };
let mood = { turboT: 0, stumbleT: 0, boost: 0, streak: 0, scrambleFlash: 0, attackT: 15, goldGap: 0 };
let charW = 18, rowChars = 40, rowBase = 0, errFlash = 0;

function makeWord() {
  const ahead = cur.words.slice(cur.wi).reduce((n, w) => n + w.t.length + 1, 0);
  const est = player.dist + Math.max(player.speed, 9) * (ahead / 5);
  const sym = cornerAt(est) || cornerAt(est + 8);
  let t, gold = false;
  if (sym) {
    const r = Math.random(), a = pick(EASY), b = pick(EASY);
    if (r < 0.2) t = '"' + a + ',"'; else if (r < 0.4) t = '(' + a + '!)'; else if (r < 0.55) t = a[0].toUpperCase() + a.slice(1) + '?';
    else if (r < 0.7) t = a + '-' + b; else if (r < 0.85) t = a + (1 + Math.floor(Math.random() * 9)) + ';'; else t = pick(CONTRACTIONS);
  } else {
    t = pick(EASY);
    cur.sinceGold++;
    if (cur.sinceGold >= cur.goldEvery && t.length >= 5) { gold = true; cur.sinceGold = 0; cur.goldEvery = 10 + Math.floor(Math.random() * 5); }
  }
  return { t, gold, scr: false, sym };
}
function initText() {
  cur = { words: [], wi: 0, ci: 0, clean: true, sinceGold: 0, goldEvery: 7, awarded: false };
  rowBase = 0; ensureWords();
}
function ensureWords() { while (cur.words.length - cur.wi < 40) cur.words.push(makeWord()); }

function shuffleWord(t) {
  const idx = []; const letters = [];
  for (let i = 0; i < t.length; i++) if (/[a-z]/i.test(t[i])) { idx.push(i); letters.push(t[i]); }
  if (letters.length < 2) return t;
  for (let tries = 0; tries < 6; tries++) {
    for (let i = letters.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [letters[i], letters[j]] = [letters[j], letters[i]]; }
    const arr = t.split(''); idx.forEach((p, n) => { arr[p] = letters[n]; });
    const out = arr.join(''); if (out !== t) return out;
  }
  return t;
}
function scrambleNext(n) {
  for (let k = 1; k <= n; k++) { const w = cur.words[cur.wi + k]; if (w) { w.t = shuffleWord(w.t); w.scr = true; } }
  mood.scrambleFlash = 1.0; renderText();
}

function computeRows() {
  const rows = []; let row = [], len = 0;
  for (let k = rowBase; k < cur.words.length && rows.length < 4; k++) {
    const l = cur.words[k].t.length + 1;
    if (len + l > rowChars && row.length) { rows.push(row); row = []; len = 0; }
    row.push(k); len += l;
  }
  if (row.length) rows.push(row);
  return rows;
}
function renderText() {
  if (!cur) return;
  let rows = computeRows();
  let ri = rows.findIndex((r) => r.includes(cur.wi));
  if (ri >= 2) { rowBase = rows[ri - 1][0]; rows = computeRows(); ri = rows.findIndex((r) => r.includes(cur.wi)); }
  let html = '';
  rows.slice(0, 3).forEach((row) => {
    html += '<div class="row">';
    for (const k of row) {
      const w = cur.words[k];
      const cls = 'w' + (k < cur.wi ? ' done' : '') + (w.gold ? ' gold' : '') + (w.scr ? ' scr' : '') + (w.mode ? ' ' + w.mode : '') + (items.fogT > 0 && k > cur.wi ? ' fogged' : '');
      html += '<span class="' + cls + '">';
      for (let c = 0; c <= w.t.length; c++) {
        const isSpace = c === w.t.length;
        let cc = isSpace ? 'sp' : '';
        if (k < cur.wi || (k === cur.wi && c < cur.ci)) cc += ' d';
        else if (k === cur.wi && c === cur.ci) cc += ' cur' + (errFlash > 0 ? ' err' : '');
        html += '<span class="' + cc.trim() + '">' + (isSpace ? (cc.includes('cur') ? '\u00a0' : '') : esc(w.t[c])) + '</span>';
      }
      html += '</span>';
    }
    html += '</div>';
  });
  $('text').innerHTML = html;
  const w = cur.words[cur.wi];
  const sym = w && w.sym;
  $('terrain').textContent = sym ? 'Curve ahead: mind the symbols' : 'Straight: fast words';
  $('terrain').className = 'chip ' + (sym ? 'curve' : 'straight');
}

function currentVehicleMul() { return rideMul(selectedRide); }
function onCorrect() {
  const m = selectedRide;
  player.speed = Math.min(VMAX, player.speed + IMPULSE * rideMul(m) * (items.nitroT > 0 ? 2 : 1));
  stats.correct++; stats.times.push(raceTime);
  mood.streak++;
  if (mood.turboT <= 0) {
    mood.boost += (mood.streak >= 6 ? 1.8 : 0.5) * (1 + 0.25 * (m.boost - 3));
    if (mood.boost >= 100) { mood.boost = 0; mood.turboT = 3; toast('TURBO!', '#3fd8e8'); sfx('turbo'); }
  }
  sfx('tick');
}
function onWrong() {
  const m = selectedRide;
  stats.wrong++; mood.streak = 0; cur.clean = false;
  if (items.freezeT > 0) { errFlash = 0.18; sfx('err'); return; }
  player.speed *= 0.5 + 0.07 * m.handling;
  mood.stumbleT = 0.4; errFlash = 0.18;
  sfx('err');
}
const MAX_ITEMS = 4;
const ITEM_POOL = { turbo: 14, triple: 6, nitro: 10, magnet: 8, shield: 12, mirror: 9, autocorrect: 10, ink: 8, torpedo: 0, scramble: 7, fog: 5, hard: 5, easy: 3, freeze: 6, lucky: 7 };
function rollItem(r0) {
  const rank = rankOf(r0 || player), w = Object.assign({}, ITEM_POOL);
  w.torpedo = rank === 1 ? 0 : rank === 2 ? 5 : 12;               // comeback item: never for the leader
  if (rank === 1) { w.ink = 3; w.scramble = 3; w.fog = 2; w.hard = 2; w.shield += 4; w.mirror += 3; }
  if (rank >= 3) { w.turbo += 6; w.ink += 4; w.easy += 3; w.nitro += 3; }
  let tot = 0; for (const k in w) tot += w[k];
  let r = Math.random() * tot; for (const k in w) { r -= w[k]; if (r <= 0) return k; }
  return 'turbo';
}
const RIVAL_POOL = ['turbo', 'turbo', 'ink', 'ink', 'scramble', 'scramble', 'fog', 'hard', 'torpedo'];
function rollRivalItem(r) { const k = pick(RIVAL_POOL); return k === 'torpedo' && rankOf(r) === 1 ? 'ink' : k; }
function giveItem(it, label) {
  if (items.list.length >= MAX_ITEMS) { mood.boost = Math.min(99, mood.boost + 30); toast('Items full: +30 boost', '#ffd23f'); return false; }
  items.list.push(it); toast(label + ITEM_NAMES[it], '#ffd23f'); sfx('item'); itemPop = items.list.length - 1; updateHud(true); return true;
}
function grantItem() { giveItem(rollItem(), 'Golden word! '); }
let itemPop = -1;
const ITEM_NAMES = { turbo: 'Turbo', triple: 'Triple Turbo', nitro: 'Nitro Words', magnet: 'Magnet', shield: 'Shield', mirror: 'Mirror', autocorrect: 'Autocorrect', ink: 'Ink Blot', torpedo: 'Torpedo', scramble: 'Scramble', fog: 'Fog Bank', hard: 'Hard Mode', easy: 'Easy Mode', freeze: 'Time Freeze', lucky: 'Lucky Box' };
const ITEM_TEXT = { turbo: 'Speed burst', triple: '3 mini speed bursts', nitro: 'Words give 2× speed for 5s', magnet: 'Pulls in boxes and gold words', shield: 'Blocks the next hit', mirror: 'Reflects the next attack', autocorrect: 'Next typo is forgiven', ink: 'Slows the racer ahead', torpedo: 'Homes in on 1st place', scramble: 'Scrambles the next words of the racer ahead', fog: 'Hides the words of the racers ahead', hard: 'Racer ahead gets long, tricky words', easy: 'Your next 3 words are short', freeze: 'No slowdown or typo penalty for 4s', lucky: 'Random item, maybe a double' };
const LONG_WORDS = 'kaleidoscope thunderstorm unbelievable extraordinary championship acceleration magnificent temperature construction adventurous spectacular continuous celebration impossible chocolate difficult mysterious navigation revolution catastrophe crocodile'.split(' ');
const SHORT_WORDS = EASY.filter((w) => w.length <= 4);
/* swap the next few upcoming words for short (easy) or long (hard) ones; gold and symbol words are left alone */
function replaceNext(n, mode) {
  let done = 0;
  for (let k = cur.wi + 1; k < cur.words.length && k < cur.wi + 14 && done < n; k++) {
    const w = cur.words[k]; if (w.gold || w.sym) continue;
    w.t = pick(mode === 'hard' ? LONG_WORDS : SHORT_WORDS); w.scr = false; w.mode = mode; done++;
  }
  renderText(); return done;
}
function pullGold() {
  let g = -1; for (let k = cur.wi + 1; k < cur.words.length; k++) if (cur.words[k].gold) { g = k; break; }
  if (g > cur.wi + 1) { const [w] = cur.words.splice(g, 1); cur.words.splice(cur.wi + 1, 0, w); renderText(); }
}
/* effects that hit a rival (an AI racer) */
const AI_DEBUFF = { ink: [4, 0.55], torpedo: [3.2, 0.4], scramble: [5, 0.62], fog: [3.5, 0.72], hard: [6, 0.7] };
function aiDebuff(r, kind) {
  const d = AI_DEBUFF[kind] || AI_DEBUFF.ink; r.dbT = d[0]; r.dbMul = d[1]; r.dbKind = kind; if (kind === 'torpedo') r.speed *= 0.5;
}
/* an attack arrives at the player: Shield blocks it, Mirror sends it back, otherwise it lands */
function hitPlayer(kind, from) {
  const nm = ITEM_NAMES[kind];
  if (items.shieldOn) { items.shieldOn = false; toast('Shield blocked ' + from.name + "'s " + nm, '#3fd8e8'); sfx('item'); return; }
  if (items.mirrorOn) { items.mirrorOn = false; aiDebuff(from, kind); toast('Mirror sent ' + nm + ' back at ' + from.name, '#7fe7ff'); sfx('item'); return; }
  if (kind === 'ink') { mood.stumbleT = 1.0; player.speed *= 0.7; }
  else if (kind === 'torpedo') { mood.stumbleT = 1.6; player.speed *= 0.5; }
  else if (kind === 'scramble') scrambleNext(3);
  else if (kind === 'fog') { items.fogT = 4; renderText(); }
  else if (kind === 'hard') replaceNext(4, 'hard');
  toast(from.name + (kind === 'torpedo' ? ' torpedoed you' : ' used ' + nm + ' on you'), '#ff6fae'); sfx('err');
}
const aheadOf = (r) => racers.filter((o) => o !== r && o.dist > r.dist).sort((a, b) => a.dist - b.dist);
/* apply an item for the player; returns false when it can't be used right now (the item is kept) */
function applyItem(it) {
  if (it === 'turbo') { mood.turboT = Math.max(mood.turboT, 2.5); toast('Turbo!', '#3fd8e8'); sfx('turbo'); }
  else if (it === 'triple') { items.tripleN = 3; items.tripleT = 0; toast('Triple Turbo!', '#ffd23f'); }
  else if (it === 'nitro') { items.nitroT = 5; toast('Nitro Words: 2× speed per word', '#ff8a3d'); sfx('turbo'); }
  else if (it === 'magnet') { items.magnetT = 9; pullGold(); toast('Magnet on', '#ff6b5a'); sfx('item'); }
  else if (it === 'shield') { if (items.shieldOn) { toast('Shield already up', '#b4acd9'); return false; } items.shieldOn = true; toast('Shield up', '#3fd8e8'); }
  else if (it === 'mirror') { if (items.mirrorOn) { toast('Mirror already up', '#b4acd9'); return false; } items.mirrorOn = true; toast('Mirror up', '#7fe7ff'); }
  else if (it === 'autocorrect') { if (items.autoOn) { toast('Autocorrect already on', '#b4acd9'); return false; } items.autoOn = true; toast('Autocorrect on: next typo forgiven', '#7be88a'); }
  else if (it === 'freeze') { items.freezeT = 4; toast('Time Freeze: no slowdown', '#8fd6ff'); sfx('item'); }
  else if (it === 'easy') { replaceNext(3, 'easy'); toast('Easy Mode: short words coming', '#a8ee6a'); sfx('item'); }
  else if (it === 'torpedo') {
    const lead = racers.filter((o) => !o.isPlayer).sort((a, b) => b.dist - a.dist)[0];
    if (!lead || lead.dist <= player.dist) { toast("You're already in front", '#b4acd9'); return false; }
    aiDebuff(lead, 'torpedo'); toast('Torpedo hit ' + lead.name, '#ff6fae'); sfx('item');
  }
  else if (it === 'fog') {
    const t = aheadOf(player).filter((o) => !o.isPlayer).slice(0, 2); if (!t.length) { toast('Nobody ahead to hit', '#b4acd9'); return false; }
    t.forEach((o) => aiDebuff(o, 'fog')); toast('Fog Bank rolled over ' + t.map((o) => o.name).join(' and '), '#8aa8ff'); sfx('item');
  }
  else if (it === 'ink' || it === 'scramble' || it === 'hard') {
    const t = aheadOf(player).filter((o) => !o.isPlayer)[0]; if (!t) { toast('Nobody ahead to hit', '#b4acd9'); return false; }
    aiDebuff(t, it); toast(ITEM_NAMES[it] + ' hit ' + t.name, '#ff6fae'); sfx('item');
  }
  else if (it === 'lucky') {
    const pool = Object.keys(ITEM_NAMES).filter((k) => k !== 'lucky'); const n = Math.random() < 0.2 ? 2 : 1; let got = [];
    for (let tries = 0; tries < 30 && got.length < n; tries++) { const k = pick(pool); if (!got.includes(k) && applyItem(k)) got.push(k); }
    toast('Lucky Box' + (n === 2 ? ' JACKPOT: ' : ': ') + got.map((k) => ITEM_NAMES[k]).join(' + '), '#ffd23f');
  }
  return true;
}
function useItem() {
  const it = items.list[0]; if (!it) return;
  if (applyItem(it) === false) return;
  items.list.shift(); updateHud(true);
}

/* ? item boxes on the road, shared by everyone; they come back a few seconds after being hit */
let itemBoxes = [], boxGeo = null, boxMat = null;
function boxTexture() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const c = cv.getContext('2d');
  const g = c.createLinearGradient(0, 0, 128, 128); g.addColorStop(0, '#ffe36a'); g.addColorStop(0.5, '#ff9d3a'); g.addColorStop(1, '#ff5fa8');
  c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 8; c.strokeRect(6, 6, 116, 116);
  c.fillStyle = '#ffffff'; c.font = 'bold 96px Arial Black, Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(80,20,90,0.6)'; c.shadowBlur = 6; c.fillText('?', 64, 70);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function buildItemBoxes() {
  for (const b of itemBoxes) raceScene.remove(b.mesh);
  itemBoxes = [];
  if (!boxGeo) { const tx = boxTexture(); boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2); boxMat = new THREE.MeshStandardMaterial({ map: tx, emissive: '#ffffff', emissiveMap: tx, emissiveIntensity: 0.55, roughness: 0.4, transparent: true, opacity: 0.95 }); }
  const n = Math.max(4, Math.round(TRACK_LEN / 130));
  for (let k = 0; k < n; k++) {
    const s = TRACK_LEN * (k + 0.55) / n - START_OFFSET;
    for (const lat of [-1.8, 1.8]) {
      const p = pointAt(s), nx = -p.tz, nz = p.tx;
      const mesh = new THREE.Mesh(boxGeo, boxMat); mesh.castShadow = true;
      mesh.position.set(p.x + nx * lat, p.y + 1.35, p.z + nz * lat); raceScene.add(mesh);
      itemBoxes.push({ mesh, dist: s, lat, y: p.y + 1.35, hide: 0, ph: Math.random() * 6, hx: mesh.position.x, hz: mesh.position.z, pulled: false });
    }
  }
}
const _mp = new THREE.Vector3();
function updateItemBoxes(dt, t) {
  for (const b of itemBoxes) {
    if (b.hide > 0) { b.hide -= dt; if (b.hide > 0) continue; b.mesh.visible = true; b.mesh.scale.setScalar(0.01); b.pulled = false; b.mesh.position.x = b.hx; b.mesh.position.z = b.hz; }
    if (b.mesh.scale.x < 1) b.mesh.scale.setScalar(Math.min(1, b.mesh.scale.x + dt * 3));
    b.mesh.rotation.y = t * 1.6 + b.ph; b.mesh.rotation.x = 0.35;
    if (!b.pulled) b.mesh.position.y = b.y + Math.sin(t * 2.4 + b.ph) * 0.18;
    if (items.magnetT > 0 && !b.pulled) {   // Magnet: boxes within reach fly to the player
      let dp = (b.dist - player.dist) % TRACK_LEN; if (dp < -TRACK_LEN / 2) dp += TRACK_LEN; if (dp > TRACK_LEN / 2) dp -= TRACK_LEN;
      if (dp > -4 && dp < 55) b.pulled = true;
    }
    if (b.pulled) {
      _mp.copy(player.v.group.position); _mp.y += 1.2; const k = 1 - Math.exp(-7 * dt);
      b.mesh.position.lerp(_mp, k);
      if (b.mesh.position.distanceTo(_mp) < 2) { b.pulled = false; collectBox(b, player); }
      continue;
    }
    for (const r of racers) {
      let ds = (r.dist - b.dist) % TRACK_LEN; if (ds > TRACK_LEN / 2) ds -= TRACK_LEN; if (ds < -TRACK_LEN / 2) ds += TRACK_LEN;
      if (Math.abs(ds) < 1.7 && Math.abs(r.lat - b.lat) < 1.8 && r.dist > 0) { collectBox(b, r); break; }
    }
  }
}
function collectBox(b, r) {
  b.hide = 5; b.mesh.visible = false;
  if (r.isPlayer) { giveItem(rollItem(), 'Item box! '); }
  else if (!r.items) r.items = [];
  if (!r.isPlayer && r.items.length < 2) { r.items.push(rollRivalItem(r)); r.useT = 2.5 + Math.random() * 4; }
}
function updateRivalItems(r, dt) {
  if (r.boostT > 0) r.boostT -= dt;
  if (!r.items || !r.items.length || state !== 'racing') return;
  r.useT -= dt; if (r.useT > 0) return;
  const it = r.items.shift(); r.useT = 3 + Math.random() * 4;
  if (it === 'turbo') { r.boostT = 2.2; return; }
  let tgt;
  if (it === 'torpedo') tgt = racers.slice().sort((a, b) => b.dist - a.dist)[0];
  else tgt = aheadOf(r)[0];
  if (!tgt || tgt === r) { r.boostT = 1.5; return; }
  if (tgt.isPlayer) hitPlayer(it, r); else aiDebuff(tgt, it);
}

function showKey(k, bad, caps) {
  const a = el.kcKey || (el.kcKey = $('kcKey')), b = el.kcap || (el.kcap = $('kcap'));
  a.textContent = k === ' ' ? '\u2423' : k; a.className = 'k' + (bad ? ' bad' : ''); b.classList.toggle('caps-on', caps);
}
function onKey(e) {
  if (e.key === 'Escape' && (state === 'racing' || state === 'countdown')) { toGarage(); return; }
  if (state !== 'racing') { if (state === 'countdown') e.preventDefault(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Tab') { e.preventDefault(); useItem(); return; }
  if (e.key.length !== 1) return;
  e.preventDefault();
  if (player.finished) return;
  const capsOn = !!(e.getModifierState && e.getModifierState('CapsLock'));
  const w = cur.words[cur.wi];
  const expected = cur.ci < w.t.length ? w.t[cur.ci] : ' ';
  const hadAuto = items.autoOn;
  if (e.key === expected) {
    onCorrect(); cur.ci++;
    if (cur.ci === w.t.length && w.gold && cur.clean && !cur.awarded) { cur.awarded = true; grantItem(); }
    if (cur.ci > w.t.length) { cur.wi++; cur.ci = 0; cur.clean = true; cur.awarded = false; ensureWords(); }
  } else if (items.autoOn) {
    items.autoOn = false; toast('Autocorrect fixed that typo', '#7be88a'); sfx('item'); cur.ci++;
    if (cur.ci > w.t.length) { cur.wi++; cur.ci = 0; cur.clean = true; cur.awarded = false; ensureWords(); }
  } else onWrong();
  if (items.magnetT > 0) pullGold();
  showKey(e.key, e.key !== expected && !hadAuto, capsOn);
  renderText();
}

/* ------------------------------------------------------------------ ranking */
const progress = (r) => r.dist;
function rankOf(r) { return 1 + racers.filter((o) => o !== r && progress(o) > progress(r)).length; }

/* ------------------------------------------------------------------ simulation */
function updateRacer(r, dt, t) {
  let v = r.speed;
  if (r.isPlayer) {
    if (!(items.freezeT > 0)) v *= Math.exp(-FRICTION * dt);
    if (v < 5) v = Math.max(0, v - 0.5 * dt); // a little rolling resistance so it rolls to a stop
    r.speed = v;
    let eff = v;
    if (mood.turboT > 0) eff *= 1.45;
    if (mood.stumbleT > 0) eff *= 0.65;
    r.eff = eff;
  } else {
    r.noiseT -= dt; if (r.noiseT <= 0) { r.noiseT = 1.5 + Math.random() * 2; r.noise = (Math.random() - 0.5) * 0.18; }
    const gap = player.dist - r.dist;
    const rb = clamp(gap / 100, -0.2, 0.2);
    let target = wpm2speed(r.wpm) * rideMul(r.ride) * (1 + r.noise + rb);
    if (r.slowT > 0) { target *= 0.55; r.slowT -= dt; }
    if (r.dbT > 0) { target *= r.dbMul; r.dbT -= dt; }
    if (r.boostT > 0) target *= 1.35;
    updateRivalItems(r, dt);
    r.speed += (target - r.speed) * (1 - Math.exp(-1.6 * dt));
    r.eff = r.speed;
  }
  if (state === 'racing' || state === 'finished') r.dist += r.eff * dt;
  // finish detection
  if (!r.finished && r.dist >= LAPS * TRACK_LEN) { r.finished = true; r.finishTime = raceTime; }
  // place the vehicle
  const p = pointAt(r.dist);
  const wob = Math.sin(t * 0.7 + r.seed) * 0.3 * Math.min(1, r.eff / 8);
  r.lat += (r.lane + wob - r.lat) * Math.min(1, dt * 3);
  const nx = -p.tz, nz = p.tx;
  r.pitch = (r.pitch || 0) + (p.pitch - (r.pitch || 0)) * Math.min(1, dt * 9);
  r.v.group.position.set(p.x + nx * r.lat, p.y, p.z + nz * r.lat);
  const wantYaw = Math.atan2(p.tx, p.tz);
  if (r.yaw === undefined) r.yaw = wantYaw;
  let dyaw = wantYaw - r.yaw; while (dyaw > Math.PI) dyaw -= 2 * Math.PI; while (dyaw < -Math.PI) dyaw += 2 * Math.PI;
  r.yaw += dyaw * Math.min(1, dt * 14);
  r.v.group.rotation.set(-r.pitch, r.yaw, 0, 'YXZ');
  const spin = (r.eff * dt) / 0.4;
  for (const wh of r.v.wheels) wh.rotation.x += spin;
  if (r.ride.kind === 'Boat') { r.v.model.position.y = -0.85 + Math.sin(t * 2.3 + r.seed) * 0.07; r.v.model.rotation.z = Math.sin(t * 1.7 + r.seed) * 0.03; r.v.model.rotation.x = Math.sin(t * 2.1 + r.seed * 2) * 0.02 - Math.min(1, r.eff / 25) * 0.04; }
  else r.v.model.position.y = (MAP.style === 'river' ? -0.5 : 0) + Math.sin(t * 14 + r.seed) * 0.012 * Math.min(1, r.eff / 10);
}

const _pp = new THREE.Vector3();
let panelTop = null, panelCw = 0;
function placePanel(gp, carYaw, dt) {
  // keep the typing box just below the car's rear tires on screen
  return; // the typing box is fixed in the 1436x840 HUD stage now (old pixel-based placement broke it)
  if (!el.panel) return;
  raceCamera.updateMatrixWorld(true);
  _pp.set(gp.x - Math.sin(carYaw) * 1.1, gp.y, gp.z - Math.cos(carYaw) * 1.1).project(raceCamera);
  const h = window.innerHeight;
  const ph = el.panel.offsetHeight || 120;
  if (window.innerWidth > 900) { const cw = Math.max(104, Math.min(190, Math.round(ph * 340 / 482))); if (cw !== panelCw) { panelCw = cw; el.panel.style.setProperty('--cw', cw + 'px'); } }
  let top = (1 - _pp.y) / 2 * h + 14;
  top = Math.max(h * 0.3, Math.min(top, h - ph - 8));
  panelTop = panelTop === null ? top : panelTop + (top - panelTop) * (1 - Math.exp(-4 * dt));
  el.panel.style.top = Math.round(panelTop) + 'px';
}
let camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), camInit = false;
let camYaw = 0;
function updateCamera(dt) {
  // chase camera locked to the car itself, so it stays centred in turns and on hills
  const gp = player.v.group.position, carYaw = player.v.group.rotation.y;
  if (!camInit) { camYaw = carYaw; camPos.set(gp.x - Math.sin(carYaw) * 7.2, gp.y + 2.9, gp.z - Math.cos(carYaw) * 7.2); camInit = true; }
  let dy = carYaw - camYaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
  camYaw += dy * (1 - Math.exp(-5 * dt));
  const sx = Math.sin(camYaw), sz = Math.cos(camYaw);
  camPos.x = gp.x - sx * 7.2; camPos.z = gp.z - sz * 7.2;
  camPos.y += (gp.y + 2.9 - camPos.y) * (1 - Math.exp(-8 * dt));
  camLook.set(gp.x + sx * 7, gp.y - 0.4, gp.z + sz * 7);
  raceCamera.position.copy(camPos);
  raceCamera.up.set(0, 1, 0);
  raceCamera.lookAt(camLook);
  placePanel(gp, carYaw, dt);
  if (mood.stumbleT > 0) { raceCamera.position.y += (Math.random() - 0.5) * 0.08; raceCamera.lookAt(camLook); }
  if (window.__tt && window.__tt.cam) { const c = window.__tt.cam; raceCamera.position.set(c[0], c[1], c[2]); raceCamera.lookAt(c[3], c[4], c[5]); raceCamera.fov = 55; raceCamera.updateProjectionMatrix(); return; }
  if (window.__tt && window.__tt.top) { raceCamera.position.set(0, 80, 0); raceCamera.up.set(0, 0, -1); raceCamera.lookAt(0, 0, 0); raceCamera.fov = 60; raceCamera.updateProjectionMatrix(); return; }
  const fovTarget = 60 + Math.min(player.eff || 0, 40) * 0.45 + (mood.turboT > 0 ? 8 : 0);
  raceCamera.fov += (fovTarget - raceCamera.fov) * (1 - Math.exp(-5 * dt));
  raceCamera.updateProjectionMatrix();
  sunTarget.position.set(gp.x, gp.y, gp.z);
  sun.position.set(gp.x - 30, 50, gp.z + 20);
}

/* ------------------------------------------------------------------ HUD */
const el = {};
function cacheEls() { ['gl', 'loading', 'profile', 'garage', 'race', 'results', 'count', 'text', 'terrain', 'pos', 'lap', 'timer', 'wpm', 'acc', 'boost', 'boostN', 'itemSlot', 'itemName', 'itemHint', 'toast', 'panel', 'turboGlow', 'scrGlow', 'raceName'].forEach((id) => { el[id] = $(id); }); }
function showScreen(name) {
  ['profile', 'garage', 'race', 'results'].forEach((s) => { el[s].hidden = s !== name && !(s === 'race' && name === 'results'); });
  $('garageBg').hidden = name !== 'garage';
}
function setText(node, v, key) { if (hudCache[key] !== v) { node.textContent = v; hudCache[key] = v; } }
function currentWpm() {
  const win = Math.min(10, Math.max(raceTime, 2));
  const n = stats.times.filter((t) => t > raceTime - win).length;
  return Math.round((n / 5) * (60 / win));
}
const DB_ICON = { ink: ['\u{1FAE7}', '#ff8fc8'], torpedo: ['\u{1F680}', '#ff9a5a'], scramble: ['\u{1F500}', '#ff8fc8'], fog: ['\u{1F32B}', '#c9cfdd'], hard: ['\u{1F525}', '#ffb36b'] };
function statusChips(r) {
  const c = [];
  if (r.isPlayer) {
    if (mood.stumbleT > 0) c.push(['\u{1F4A5}', '#ff8fc8']);
    if (items.fogT > 0) c.push(['\u{1F32B}' + Math.ceil(items.fogT) + 's', '#c9cfdd']);
    if (items.shieldOn) c.push(['\u{1F6E1}', '#7be88a']);
    if (items.mirrorOn) c.push(['\u{1FA9E}', '#8fe3ff']);
    if (items.freezeT > 0) c.push(['\u2744' + Math.ceil(items.freezeT) + 's', '#8fe3ff']);
    if (mood.turboT > 0 || items.nitroT > 0 || items.tripleN > 0) c.push(['\u26A1', '#ffb347']);
  } else if (r.dbT > 0) {
    const d = DB_ICON[r.dbKind] || DB_ICON.ink; c.push([d[0] + Math.ceil(r.dbT) + 's', d[1]]);
  }
  return c.slice(0, 2).map((x) => '<s style="background:' + x[1] + '">' + x[0] + '</s>').join('');
}
function updateHud(force) {
  if (!player) return;
  const rank = rankOf(player);
  if (hudCache.pos !== rank) { hudCache.pos = rank; el.pos.innerHTML = rank + '<i>/' + racers.length + '</i>'; }
  const lap = clamp(Math.floor(Math.max(0, player.dist) / TRACK_LEN) + 1, 1, LAPS);
  { // live standings
    const order = racers.slice().sort((p, q) => progress(q) - progress(p));
    let h = '';
    order.forEach((r, i) => {
      const gap = Math.round(progress(r) - progress(player));
      const g = r === player ? 'YOU' : (gap > 0 ? '+' : '-') + Math.abs(gap) + 'm';
      h += '<div class="br' + (r === player ? ' me' : '') + '" style="--c:' + r.color + '"><em>' + (i + 1) + '</em><i style="background:linear-gradient(135deg,' + r.color + ',' + r.color + '88)"><img alt="" src="' + (thumbURL[r.ride.id] || BLANK) + '"></i><span class="nm">' + esc(r.name) + '</span><b class="xs">' + statusChips(r) + '</b><u>' + g + '</u></div>';
    });
    if (hudCache.board !== h) { hudCache.board = h; (el.board || (el.board = $('board'))).innerHTML = h; }
  }
  if (hudCache.lap !== lap) { hudCache.lap = lap; el.lap.innerHTML = lap + '<i>/' + LAPS + '</i>'; }
  if (force) lastLap = lap; else if (lap > lastLap && state === 'racing') { lastLap = lap; toast(lap === LAPS ? 'FINAL LAP!' : 'Lap ' + lap + ' of ' + LAPS, lap === LAPS ? '#ff6fae' : '#3fd8e8'); sfx('item'); }
  setText(el.timer, fmtTime(raceTime), 'timer');
  setText(el.wpm, String(state === 'racing' || state === 'finished' ? currentWpm() : 0), 'wpm');
  const tot = stats.correct + stats.wrong;
  setText(el.acc, (tot ? Math.round((stats.correct / tot) * 100) : 100) + '%', 'acc');
  el.boost.style.width = (mood.turboT > 0 ? (mood.turboT / 3) * 100 : mood.boost) + '%';
  el.boost.className = 'fill' + (mood.turboT > 0 ? ' hot' : '');
  setText(el.boostN, mood.turboT > 0 ? 'TURBO' : mood.streak + ' clean', 'boostN');
  for (let k = 0; k < MAX_ITEMS; k++) {
    const kind = items.list[k], sig = (kind || '-') + (itemPop === k ? 'p' : '');
    if (hudCache['it' + k] !== sig) {
      hudCache['it' + k] = sig; const node = el['it' + k] || (el['it' + k] = $('it' + k));
      const badge = '<span class="kb' + (k ? '' : ' k1') + '">' + (k ? k + 1 : 'TAB') + '</span>';
      node.innerHTML = kind
        ? badge + '<div class="art"><img alt="" src="cards/art_' + kind + '.webp"></div><div class="nm">' + ITEM_NAMES[kind] + '</div><div class="ru">' + ITEM_TEXT[kind] + '</div><div class="bl"></div>'
        : badge + '<div class="em"><svg viewBox="0 0 24 24" width="34" height="34" fill="#ffd24a"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg></div>';
      node.className = 'kc' + (kind ? (k ? '' : ' face') : ' back') + (itemPop === k ? ' pop' : '');
    }
  }
  { // active effects
    const fx = [];
    if (items.shieldOn) fx.push(['Shield', 'good']); if (items.mirrorOn) fx.push(['Mirror', 'good']); if (items.autoOn) fx.push(['Autocorrect', 'good']);
    if (items.nitroT > 0) fx.push(['Nitro ' + Math.ceil(items.nitroT) + 's', 'hot']); if (items.magnetT > 0) fx.push(['Magnet ' + Math.ceil(items.magnetT) + 's', 'hot']);
    if (items.freezeT > 0) fx.push(['Freeze ' + Math.ceil(items.freezeT) + 's', 'good']); if (items.tripleN > 0) fx.push(['Triple x' + items.tripleN, 'hot']);
    if (items.fogT > 0) fx.push(['Fogged ' + Math.ceil(items.fogT) + 's', 'bad']);
    const h = fx.map((f) => '<span class="' + f[1] + '">' + f[0] + '</span>').join('');
    if (hudCache.fx !== h) { hudCache.fx = h; (el.fx || (el.fx = $('fx'))).innerHTML = h; }
  }
  if (itemPop >= 0) itemPop = -1;
  el.turboGlow.style.opacity = mood.turboT > 0 ? 1 : 0;
  el.scrGlow.style.opacity = Math.max(0, mood.scrambleFlash);
  drawMini();
}
/* minimap: the real shape of the track, with a dot per racer */
let mini = null;
function buildMini() {
  const cv = $('mini'); if (!cv) return;
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const q of PTS) { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); z0 = Math.min(z0, q.z); z1 = Math.max(z1, q.z); }
  const maxW = 214, maxH = 134, pad = 12;
  const sc = Math.min((maxW - 2 * pad) / (x1 - x0), (maxH - 2 * pad) / (z1 - z0));
  const w = Math.round((x1 - x0) * sc + 2 * pad), h = Math.round((z1 - z0) * sc + 2 * pad), dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.style.width = w + 'px'; cv.style.height = h + 'px'; cv.width = w * dpr; cv.height = h * dpr;
  const P = (q) => [(q.x - x0) * sc + pad, (q.z - z0) * sc + pad];
  const bg = document.createElement('canvas'); bg.width = cv.width; bg.height = cv.height;
  const g = bg.getContext('2d'); g.scale(dpr, dpr); g.lineJoin = 'round'; g.lineCap = 'round';
  const trace = () => { g.beginPath(); PTS.forEach((q, i) => { const [x, y] = P(q); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); };
  trace(); g.strokeStyle = '#f6f3ff'; g.lineWidth = 9; g.stroke();
  trace(); g.strokeStyle = '#2d2559'; g.lineWidth = 5.5; g.stroke();
  // start/finish tick
  const a = P(PTS[0]); g.fillStyle = '#ffd23f'; g.fillRect(a[0] - 5, a[1] - 5, 10, 3);
  mini = { cv, bg, P, dpr, w, h, key: MAP.id };
}
function drawMini() {
  if (!mini || mini.key !== MAP.id) buildMini();
  if (!mini) return;
  const c = mini.cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, mini.cv.width, mini.cv.height); c.drawImage(mini.bg, 0, 0);
  c.scale(mini.dpr, mini.dpr);
  const order = racers.slice().sort((a, b) => (a.isPlayer ? 1 : 0) - (b.isPlayer ? 1 : 0));
  for (const r of order) {
    const p = pointAt(r.dist); const [x, y] = mini.P(p);
    const rad = r.isPlayer ? 6.5 : 5;
    c.beginPath(); c.arc(x, y, rad, 0, 6.2832); c.fillStyle = r.color; c.fill(); c.lineWidth = r.isPlayer ? 2.5 : 1.5; c.strokeStyle = '#ffffff'; c.stroke();
  }
}
let toastT = 0;
function toast(msg, color) { el.toast.textContent = msg; el.toast.style.background = color; el.toast.className = 'toast show'; toastT = 1.6; }

/* ------------------------------------------------------------------ results */
function showResults() {
  state = 'finished';
  const total = LAPS * TRACK_LEN;
  const rows = racers.map((r) => {
    let t = r.finished ? r.finishTime : raceTime + (total - r.dist) / Math.max(r.speed, 6);
    return { r, t, done: r.finished };
  }).sort((a, b) => a.t - b.t);
  const myRank = rows.findIndex((x) => x.r === player) + 1;
  const myTime = player.finishTime;
  let newBest = false;
  if (!best || myTime < best) { best = myTime; newBest = true; try { localStorage.setItem('turbotype-best-' + MAP.id, String(myTime)); } catch (e) { /* ignore */ } }
  const tot = stats.correct + stats.wrong;
  const acc = tot ? Math.round((stats.correct / tot) * 100) : 100;
  const avgWpm = Math.round(stats.correct / 5 / (myTime / 60));
  const ord = ordinal(myRank), mm = /^(\d+)(.*)$/.exec(ord) || [0, ord, ''];
  $('resPos').innerHTML = mm[1] + '<sup>' + mm[2] + '</sup>';
  const win = rows[0];
  $('resSub').innerHTML = myRank === 1 ? 'You won the race.' : 'Race finished in <b>' + fmtTime(myTime) + '</b>.<br>' + esc(win.r.name) + ' won by ' + (myTime - win.t).toFixed(1) + ' seconds.';
  $('resTrack').textContent = MAP.name + ' \u00b7 ' + LAPS + ' laps';
  $('resCar').src = thumbURL[selectedRide.id] || BLANK;
  let html = '';
  rows.forEach((x, n) => {
    const gap = n === 0 ? 'WINNER' : (x.done ? '+' : '~+') + (x.t - win.t).toFixed(1) + 's';
    html += '<div class="rr' + (x.r.isPlayer ? ' me' : '') + '" style="--c:' + x.r.color + '"><em>' + (n + 1) + '</em><i style="background:linear-gradient(135deg,' + x.r.color + ',' + x.r.color + '88)"><img alt="" src="' + (thumbURL[x.r.ride.id] || BLANK) + '"></i><span class="nm">' + esc(x.r.name) + '</span><u>' + (x.done ? '' : '~') + fmtTime(x.r.isPlayer ? myTime : x.t) + '</u><s>' + gap + '</s></div>';
  });
  $('resRows').innerHTML = html;
  $('resWpm').textContent = String(avgWpm);
  $('resAcc').textContent = acc + '%';
  $('resBest').textContent = best ? fmtTime(best) : '-';
  $('resBestLab').textContent = 'Best time'; $('resNew').hidden = !newBest;
  el.results.hidden = false;
  el.race.hidden = false; el.race.querySelector('.fit').style.display = 'none';
  el.panel.style.display = 'none';
  sfx('item');
}

/* ------------------------------------------------------------------ audio */
let AC = null, eng = null, engGain = null, muted = false;
function audioStart() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    eng = AC.createOscillator(); eng.type = 'sawtooth';
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
    engGain = AC.createGain(); engGain.gain.value = 0;
    eng.connect(lp); lp.connect(engGain); engGain.connect(AC.destination); eng.start();
  } catch (e) { AC = null; }
}
function beep(freq, dur, type, vol, slide) {
  if (!AC || muted) return;
  try {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, AC.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, AC.currentTime + dur);
    g.gain.setValueAtTime(vol, AC.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + dur + 0.02);
  } catch (e) { /* ignore */ }
}
function sfx(kind) {
  if (kind === 'tick') beep(880 + Math.random() * 120, 0.04, 'triangle', 0.025);
  else if (kind === 'err') beep(150, 0.12, 'square', 0.04, 90);
  else if (kind === 'turbo') beep(300, 0.5, 'sawtooth', 0.04, 900);
  else if (kind === 'item') { beep(660, 0.1, 'triangle', 0.05); setTimeout(() => beep(990, 0.15, 'triangle', 0.05), 90); }
  else if (kind === 'count') beep(520, 0.15, 'square', 0.04);
  else if (kind === 'go') beep(1040, 0.35, 'square', 0.05);
}
function engineUpdate() {
  if (!AC || !eng) return;
  const racing = state === 'racing' || state === 'countdown';
  const v = player ? (player.eff || 0) : 0;
  eng.frequency.setTargetAtTime(48 + v * 6, AC.currentTime, 0.1);
  engGain.gain.setTargetAtTime(racing && !muted ? 0.035 + Math.min(v, 30) * 0.0008 : 0, AC.currentTime, 0.15);
}

/* ------------------------------------------------------------------ garage UI */
let garageSpin = 0;
const thumbURL = {};
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const AVS = ['😎', '🤠', '🦊', '🐯', '🐼', '🐸', '🦄', '🐙', '🤖', '👽', '🦖', '🐲'], BGS = ['#6a3bd0', '#d0583b', '#2f8f6a', '#c9962a', '#3b7fd0', '#3f9a3b', '#c03b9a', '#2a9aa8', '#5a6a8a', '#7a4bd0', '#2f9a5a', '#c0402a'];
let profile = { name: '', av: 0 };
const me = () => ({ name: (profile.name || '').trim() || 'You', av: AVS[profile.av % AVS.length], color: BGS[profile.av % BGS.length] });
const WX_UI = { clear: ['Clear', '#f3c94a'], rain: ['Rain', '#5aa0e0'], snow: ['Snow', '#cfe6f5'], sand: ['Dust', '#d9a35a'], fog: ['Fog', '#9aa3b5'] };
const visRides = () => RIDES;
/* voting: everyone in the lobby votes for a track and a weather; the most votes wins, ties are random */
let myVote = { map: 0, wx: 0 }, botVote = [], tieSeed = Math.random();
function rollBotVotes() { botVote = RIVALS.map(() => ({ map: Math.floor(Math.random() * MAPS.length), wx: Math.floor(Math.random() * WEATHERS.length) })); tieSeed = Math.random(); }
function voters() { const m = me(); return [{ key: 'you', av: m.av, color: m.color, ...myVote }].concat(RIVALS.map((r, i) => ({ key: r.name, av: r.av, color: r.color, ...botVote[i] })).filter((v, i) => !room || room.members[i].voted)); }
function tally(kind, n) {
  const counts = new Array(n).fill(0); voters().forEach((v) => { counts[v[kind]]++; });
  const top = Math.max(...counts), ties = counts.map((c, i) => (c === top ? i : -1)).filter((i) => i >= 0);
  return { counts, lead: ties[Math.floor(tieSeed * ties.length) % ties.length] };
}
function botRideList() {
  const out = [], river = MAP && MAP.style === 'river';
  RIVALS.forEach((rv, n) => {
    const prefs = river ? { Mira: ['marlin', 'wave', 'storm', 'jet', 'comet'], Pip: ['jet', 'sail', 'comet', 'wave', 'storm'], Jonas: ['tug', 'comet', 'sail', 'storm', 'wave'] }[rv.name] : rv.pref;
    const id = prefs.find((x) => x !== selectedRide.id && !out.some((r) => r.id === x));
    out.push(RIDES.find((r) => r.id === id) || RIDES.find((r) => r.id !== selectedRide.id && !out.includes(r)));
  });
  return out;
}
/* ---- the room: a code, simulated friends who join / pick a ride / vote / ready up, and a race that starts once everyone is ready ---- */
let room = null, roomTimer = 0; const closedRooms = new Set();
const mkCode = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 7; i++) c += A[Math.floor(Math.random() * A.length)]; return c.slice(0, 4) + '-' + c.slice(4); };
function closeRoomTimer() { if (roomTimer) { clearInterval(roomTimer); roomTimer = 0; } }
function openRoom(code, joining) {
  closeRoomTimer();
  const members = RIVALS.map((rv, i) => {
    const joinAt = joining ? (i === 0 ? -9 : i === 1 ? -3 : 0.6 + Math.random() * 2.2) : 0.6 + i * 0.9 + Math.random() * 2.2;
    const pickAt = joinAt + 1 + Math.random() * 2.5;
    return { rv, joinAt, pickAt, voteAt: pickAt + 0.3 + Math.random() * 1.5, readyAt: pickAt + 1.5 + Math.random() * 4, joined: false, picked: false, voted: false, ready: false };
  });
  room = { code, members, t0: performance.now() / 1000, ready: false, started: false };
  rollBotVotes();
  roomTimer = setInterval(roomTick, 250); roomTick(); applyVotes();
}
function roomTick() {
  if (!room || state !== 'garage') return;
  const t = performance.now() / 1000 - room.t0; let ch = false;
  room.members.forEach((m) => {
    if (!m.joined && t >= m.joinAt) { m.joined = true; ch = true; }
    if (m.joined && !m.picked && t >= m.pickAt) { m.picked = true; ch = true; }
    if (m.picked && !m.voted && t >= m.voteAt) { m.voted = true; ch = true; }
    if (m.voted && !m.ready && t >= m.readyAt) { m.ready = true; ch = true; }
  });
  if (ch) applyVotes();
  updateRoomUI();
  if (room.ready && room.members.every((m) => m.ready)) launchRoom();
}
function launchRoom() { closeRoomTimer(); closedRooms.add(room.code); room.started = true; audioStart(); startRace(); }
function updateRoomUI() {
  if (!room) return;
  const rc = $('rcTxt'); if (rc && rc.textContent !== room.code) rc.textContent = room.code;
  const joined = room.members.filter((m) => m.joined), wait = joined.filter((m) => !m.ready);
  const nReady = (room.ready ? 1 : 0) + joined.filter((m) => m.ready).length;
  const msg = $('roomMsg'); if (msg) msg.innerHTML = 'Race starts when everyone is ready<br><b>' + nReady + ' of ' + (joined.length + 1) + ' ready</b> &middot; up to 6 players<br><span>&#10003; ready &nbsp; &hellip; choosing</span>';
  const b = $('startBtn'), want = room.ready ? 'r' + (wait.length ? wait[0].rv.name : '') : 'o';
  if (b.dataset.s !== want) {
    b.dataset.s = want; b.classList.toggle('ready', room.ready);
    b.innerHTML = room.ready ? '<span class="k">&#10003;</span><span class="t">READY</span><span class="t wt">WAITING FOR<br>' + esc(wait.length ? wait[0].rv.name.toUpperCase() : 'PLAYERS') + '&hellip;</span>' : '<span class="k">A</span><span class="t">OK</span>';
  }
}
const chipsHtml = (list) => (list.length ? '<div class="vcs">' + list.map((v) => '<u class="vc" style="background:' + v.color + '">' + v.av + '</u>').join('') + '</div>' : '');
function renderRideCards() {
  const bots = botRideList(), pick = {};
  bots.forEach((r, i) => { if (!room || room.members[i].picked) pick[r.id] = RIVALS[i]; });
  let h = '';
  RIDES.forEach((r) => {
    const p = pick[r.id], on = r.id === selectedRide.id;
    const tag = on ? '<b>P1</b>' : p ? '<b style="background:' + p.color + ';color:#fff">' + p.av + ' ' + esc(p.name) + '</b>' : '';
    const st = p && !on ? ' style="outline:2px solid ' + p.color + ';outline-offset:-2px;background:linear-gradient(160deg,' + p.color + '88,' + p.color + '22)"' : '';
    h += '<button type="button" class="cell' + (on ? ' sel' : '') + '" data-id="' + r.id + '" aria-pressed="' + on + '" aria-label="' + esc(r.name) + '"' + st + '><img alt="" src="' + (thumbURL[r.id] || BLANK) + '">' + tag + '</button>';
  });
  for (let i = RIDES.length; i % 5; i++) h += '<div class="cell empty"></div>';
  const g = $('cards'); g.innerHTML = h;
  [...g.querySelectorAll('button')].forEach((b) => b.addEventListener('click', () => selectRide(RIDES.find((r) => r.id === b.dataset.id))));
  const m = me();
  const alt = (av, name, c, ride, p1, st, pend) => '<div class="alt' + (pend ? ' pend' : '') + '" style="background:linear-gradient(135deg,' + c + ',' + c + '88)"><i>' + av + '</i><img alt="" src="' + (pend ? BLANK : (thumbURL[ride.id] || BLANK)) + '"><span>' + esc(name) + '</span>' + (p1 ? '<b>P1</b>' : '') + (st ? '<em class="bd ' + st + '">' + (st === 'y' ? '&#10003;' : '&hellip;') + '</em>' : '') + '</div>';
  const slot = '<div class="alt slot">WAITING<br>FOR PLAYER</div>';
  let jh = alt(m.av, m.name, m.color, selectedRide, true, room ? (room.ready ? 'y' : 'n') : '', false);
  RIVALS.forEach((r, i) => { const mem = room && room.members[i]; if (mem && !mem.joined) { jh += slot; return; } jh += alt(r.av, r.name, r.color, bots[i], false, mem ? (mem.ready ? 'y' : 'n') : '', !!mem && !mem.picked); });
  if (room) jh += slot + slot;
  $('joined').innerHTML = jh;
}
function renderVotes() {
  const vs = voters(), tm = tally('map', MAPS.length), tw = tally('wx', WEATHERS.length);
  [...$('mapCards').children].forEach((b, i) => {
    const mine = vs.filter((v) => v.map === i);
    b.classList.toggle('sel', myVote.map === i); b.setAttribute('aria-pressed', myVote.map === i ? 'true' : 'false');
    [...b.querySelectorAll('.vcs,.lead')].forEach((n) => n.remove());
    b.insertAdjacentHTML('beforeend', chipsHtml(mine) + (tm.lead === i ? '<em class="lead">' + tm.counts[i] + '</em>' : ''));
  });
  [...$('wxChips').children].forEach((b, i) => {
    const mine = vs.filter((v) => v.wx === i);
    b.classList.toggle('sel', myVote.wx === i); b.setAttribute('aria-pressed', myVote.wx === i ? 'true' : 'false');
    [...b.querySelectorAll('.vcs,.lead')].forEach((n) => n.remove());
    b.insertAdjacentHTML('beforeend', chipsHtml(mine) + (tw.lead === i ? '<em class="lead">' + tw.counts[i] + '</em>' : ''));
  });
}
function applyVotes() {
  const tm = tally('map', MAPS.length), tw = tally('wx', WEATHERS.length);
  const lead = MAPS[tm.lead];
  if (!MAP || MAP.id !== lead.id) { buildTrack(lead); loadBest(); }
  WX = WEATHERS[tw.lead].id;
  renderVotes(); renderRideCards(); updateSum();
}
function stepRide(d) {
  const list = visRides(); let i = list.indexOf(selectedRide); i = i < 0 ? 0 : (i + d + list.length) % list.length; selectRide(list[i]);
}
function selectRide(ride) {
  selectedRide = ride; garagePop = 1; garageIdle = Math.max(garageIdle, 0.6);
  RIDES.forEach((r) => { garageModels[r.id].group.visible = r.id === ride.id; });
  $('gName').textContent = ride.name;
  $('gTrait').textContent = ride.trait;
  [['gSpeed', ride.speed], ['gHandling', ride.handling], ['gBoost', ride.boost]].forEach(([id, n]) => {
    [...$(id).children].forEach((p, i) => { p.className = 'pip' + (i < n ? ' on' : ''); });
  });
  renderRideCards();
  saveSetup();
}
function updateSum() { try { setGarageTheme(MAP); } catch (e) { console.error(e); } }
function saveSetup() { updateSum(); try { localStorage.setItem('turbotype-setup', JSON.stringify({ map: MAPS[myVote.map].id, wx: WEATHERS[myVote.wx].id, ride: selectedRide && selectedRide.id })); } catch (e) { /* ignore */ } }
/* vote for a track (force = everybody votes the same, used by tests) */
function selectMap(map, force) {
  myVote.map = Math.max(0, MAPS.indexOf(map));
  if (force) botVote.forEach((b) => { b.map = myVote.map; });
  applyVotes(); saveSetup();
}
function selectWeather(id, force) {
  myVote.wx = Math.max(0, WEATHERS.findIndex((w) => w.id === id));
  if (force) botVote.forEach((b) => { b.wx = myVote.wx; });
  applyVotes(); saveSetup();
}
function drawMapThumb(cv, map) {
  const cx = cv.getContext('2d'); const w = cv.width, h = cv.height;
  const bg = { forest: '#5f9f45', desert: '#d9b878', snow: '#e8f0f7', city: '#8b90a0' }[map.style === 'space' ? 'city' : map.biome];
  cx.fillStyle = map.style === 'space' ? '#b5532f' : map.style === 'river' ? '#55d4b6' : bg; cx.fillRect(0, 0, w, h);
  cx.fillStyle = 'rgba(255,255,255,0.08)'; for (let x = 0; x < w; x += 24) for (let y = 0; y < h; y += 24) if (((x + y) / 24) % 2 === 0) cx.fillRect(x, y, 24, 24);
  const xs = map.verts.map((v) => v[0]), ys = map.verts.map((v) => v[1]);
  const mnx = Math.min(...xs), mxx = Math.max(...xs), mny = Math.min(...ys), mxy = Math.max(...ys);
  const pad = 22, sc = Math.min((w - 2 * pad) / (mxx - mnx || 1), (h - 2 * pad) / (mxy - mny || 1));
  const ox = (w - (mxx - mnx) * sc) / 2, oy = (h - (mxy - mny) * sc) / 2;
  const P = (v) => [ox + (v[0] - mnx) * sc, oy + (v[1] - mny) * sc];
  cx.lineJoin = 'round'; cx.lineCap = 'round';
  cx.beginPath(); map.verts.forEach((v, i) => { const [x, y] = P(v); i ? cx.lineTo(x, y) : cx.moveTo(x, y); }); cx.closePath();
  cx.strokeStyle = '#ffffff'; cx.lineWidth = 15; cx.stroke(); cx.strokeStyle = '#33333d'; cx.lineWidth = 10; cx.stroke();
  const [sx, sy] = P(map.verts[0]); cx.fillStyle = '#ffd23f'; cx.beginPath(); cx.arc(sx, sy, 7, 0, 7); cx.fill();
}
const bestOf = (id) => { try { return parseFloat(localStorage.getItem('turbotype-best-' + id) || (id === 'forest' ? localStorage.getItem('turbotype-best') : '')) || null; } catch (e) { return null; } };
function refreshBests() { document.querySelectorAll('[data-best]').forEach((n) => { const v = bestOf(n.dataset.best); n.textContent = v ? 'Best ' + fmtTime(v) : 'No time yet'; }); }
function buildSetupUI() {
  $('mapCards').innerHTML = MAPS.map((m) => '<button type="button" class="map" data-id="' + m.id + '" aria-label="' + esc(m.name) + '"><canvas width="256" height="144"></canvas><span>' + esc(m.name) + '</span></button>').join('');
  [...$('mapCards').children].forEach((b, n) => { drawMapThumb(b.querySelector('canvas'), MAPS[n]); b.addEventListener('click', () => selectMap(MAPS[n])); });
  $('wxChips').innerHTML = WEATHERS.map((w) => '<button type="button" class="wxt" data-id="' + w.id + '"><i style="background:' + (WX_UI[w.id] || ['', '#ccc'])[1] + '"></i>' + esc((WX_UI[w.id] || [w.name])[0]) + '</button>').join('');
  [...$('wxChips').children].forEach((b) => b.addEventListener('click', () => selectWeather(b.dataset.id)));
  rollBotVotes();
  let saved = null; try { saved = JSON.parse(localStorage.getItem('turbotype-setup')); } catch (e) { saved = null; }
  const m = (saved && MAPS.find((x) => x.id === saved.map)) || MAPS[0];
  myVote.map = MAPS.indexOf(m);
  myVote.wx = saved && WEATHERS.some((w) => w.id === saved.wx) ? WEATHERS.findIndex((w) => w.id === saved.wx) : Math.max(0, WEATHERS.findIndex((w) => w.id === m.weather));
  buildTrack(MAPS[tally('map', MAPS.length).lead]); loadBest();
  applyVotes();
}
function buildGarageUI() {
  ['gSpeed', 'gHandling', 'gBoost'].forEach((id) => { $(id).innerHTML = '<i class="pip"></i><i class="pip"></i><i class="pip"></i><i class="pip"></i><i class="pip"></i>'; });
  window.addEventListener('keydown', (e) => { if (state === 'garage' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); stepRide(e.key === 'ArrowLeft' ? -1 : 1); } });
  let lx = 0;
  const gl = $('gl');
  gl.addEventListener('pointerdown', (e) => { if (state !== 'garage') return; garageDrag = true; lx = e.clientX; try { gl.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } });
  gl.addEventListener('pointermove', (e) => { if (!garageDrag) return; garageSpin += (e.clientX - lx) * 0.012; lx = e.clientX; });
  const end = () => { if (garageDrag) { garageDrag = false; garageIdle = 1.8; } };
  gl.addEventListener('pointerup', end); gl.addEventListener('pointercancel', end);
}
function renderThumbs() {
  // draw a preview of each ride framed to fill a 4:3 cell, then show them on the cards
  const W = 400, H = 300;
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
  const r2 = new THREE.WebGLRenderer({ canvas: tmp, antialias: true, alpha: true, preserveDrawingBuffer: true });
  r2.setSize(W, H, false); r2.setClearColor(0x000000, 0); r2.toneMapping = THREE.ACESFilmicToneMapping; r2.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight('#ffffff', '#9aa0c8', 1.4));
  const d = new THREE.DirectionalLight('#fff3d6', 2.4); d.position.set(-6, 9, 7); sc.add(d);
  const cam = new THREE.PerspectiveCamera(24, W / H, 0.1, 200);
  const dir = new THREE.Vector3(0.95, 0.85, 1.25).normalize();
  RIDES.forEach((ride) => {
    const v = makeVehicle(ride); sc.add(v.group); v.group.updateMatrixWorld(true);
    const bx = new THREE.Box3().setFromObject(v.group), Y = new THREE.Vector3(0, 1, 0);
    const c = bx.getCenter(new THREE.Vector3()).applyAxisAngle(Y, -0.62); v.group.rotation.y = -0.62; v.group.updateMatrixWorld(true);
    const pts = []; for (const x of [bx.min.x, bx.max.x]) for (const y of [bx.min.y, bx.max.y]) for (const z of [bx.min.z, bx.max.z]) pts.push(new THREE.Vector3(x, y, z).applyAxisAngle(Y, -0.62));
    let dist = bx.getSize(new THREE.Vector3()).length() * 3;
    for (let it = 0; it < 6; it++) {
      cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c); cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
      let mx = 0, my = 0; for (const p of pts) { const q = p.clone().project(cam); mx = Math.max(mx, Math.abs(q.x)); my = Math.max(my, Math.abs(q.y)); }
      dist *= Math.max(mx, my) / 0.93;
    }
    cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c);
    r2.render(sc, cam);
    thumbURL[ride.id] = tmp.toDataURL('image/png');
    sc.remove(v.group);
  });
  r2.dispose(); renderRideCards();
}
function toGaragePage(code, joining) { state = 'garage'; showScreen('garage'); layout(); openRoom(code || mkCode(), !!joining); }
function toGarage() {
  for (const b of itemBoxes) raceScene.remove(b.mesh); itemBoxes = [];
  state = 'garage'; showScreen('garage'); el.results.hidden = true; el.count.hidden = true; el.race.querySelector('.fit').style.display = '';
  for (const r of racers) raceScene.remove(r.v.group);
  racers = []; player = null; camInit = false; mini = null;
  openRoom(mkCode(), false);
  layout();
}

/* ------------------------------------------------------------------ layout */
let viewport = { x: 0, y: 0, w: 1, h: 1 };
function measureChar() {
  const probe = $('probe'); const r = probe.getBoundingClientRect();
  charW = (probe.offsetWidth / 10) || 14.4;
  const tw = el.text.clientWidth || 800;
  rowChars = Math.max(18, Math.floor(tw / charW) - 1);
}
/* the two dark slanted shades of the ride page, in 1436x840 stage coordinates */
const veilScene = new THREE.Scene(), veilCam = new THREE.OrthographicCamera(0, 1, 0, -1, -1, 1);
const VEILS = [[[446, -1000], [919, -1000], [581, 1840], [-11, 1840]], 0.5, [[909, -1000], [3436, -1000], [3436, 1840], [571, 1840]], 0.62];
let veilMeshes = [];
function buildVeil(w, h, u) {
  veilMeshes.forEach((m) => { veilScene.remove(m); m.geometry.dispose(); }); veilMeshes = [];
  for (let i = 0; i < VEILS.length; i += 2) {
    const sh = new THREE.Shape(VEILS[i].map(([x, y]) => new THREE.Vector2(w / 2 + (x - 718) * u, -(h / 2 + (y - 420) * u))));
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: VEILS[i + 1], depthTest: false, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
    veilScene.add(m); veilMeshes.push(m);
  }
  veilCam.left = 0; veilCam.right = w; veilCam.top = 0; veilCam.bottom = -h; veilCam.updateProjectionMatrix();
}
function layout() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  const u = Math.min(w / 1436, h / 840);
  $('app').style.setProperty('--u', String(u));
  $('app').style.setProperty('--ex', Math.max(0, (w / u - 1436) / 2) + 'px');
  viewport = { x: 0, y: 0, w, h };
  buildVeil(w, h, u);
  raceCamera.aspect = w / h; raceCamera.updateProjectionMatrix();
  garageCamera.aspect = w / h;
  // put the garage car at the left of the 1436x840 stage, whatever the window size
  garageCamera.setViewOffset(w, h, Math.round(w / 2 - (w / 2 + (GCAR.x - 718) * u)), Math.round(h / 2 - (h / 2 + (GCAR.y - 420) * u)), w, h);
  // keep the car the same size relative to the 1436x840 stage, even in tall or narrow windows
  garageCamera.fov = 2 * Math.atan(Math.tan(GCAR.fov * Math.PI / 360) * h / (840 * u)) * 180 / Math.PI;
  garageCamera.updateProjectionMatrix();
  if (cur) { measureChar(); renderText(); }
}
const GCAR = { x: 440, y: 440, fov: 31 };
window.addEventListener('resize', layout);

/* ------------------------------------------------------------------ main loop */
let last = 0, tAcc = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; tAcc += dt;
  if (state === 'loading' || state === 'profile') return;
  if (state === 'garage') {
    garageT += dt;
    if (garageIdle > 0) garageIdle -= dt; else if (!garageDrag) garageSpin += dt * 0.45;
    garagePop = Math.max(0, garagePop - dt * 2.2);
    const pe = garagePop * garagePop;
    const g = garageModels[selectedRide.id].group; g.rotation.y = -0.62 + garageSpin; g.position.y = 0.8 * 0.6 + pe * 0.45; g.scale.setScalar(1 - 0.07 * pe);
    garageTurn.rotation.y = garageSpin; garageTurn.scale.setScalar(0.6);
    garageCamera.position.set(5.4 + Math.sin(garageT * 0.25) * 0.3, 5.0 + Math.sin(garageT * 0.4) * 0.08, 9.8); garageCamera.lookAt(0, 0.9, 0);
    if (renderer.toneMapping !== THREE.NeutralToneMapping) renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    if (garageDust) { const p = garageDust.geometry.attributes.position.array; for (let i = 0; i < p.length; i += 3) { p[i + 1] += dt * 0.12; p[i] += Math.sin(garageT * 0.5 + i) * dt * 0.05; if (p[i + 1] > 7) p[i + 1] = 0.3; } garageDust.geometry.attributes.position.needsUpdate = true; }
    renderer.setViewport(viewport.x, viewport.y, viewport.w, viewport.h);
    // the dark side shades are drawn between two passes so the ride and its plinth stay in front of them
    renderer.autoClear = false; renderer.clear();
    renderer.render(garageScene, garageCamera);
    renderer.render(veilScene, veilCam);
    renderer.clearDepth();
    const keep = new Set([garageTurn, garageModels[selectedRide.id].group]), hid = [];
    garageScene.children.forEach((c) => { if (!c.isLight && !keep.has(c) && c.visible) { c.visible = false; hid.push(c); } });
    const sau = renderer.shadowMap.autoUpdate; renderer.shadowMap.autoUpdate = false;
    renderer.render(garageScene, garageCamera);
    renderer.shadowMap.autoUpdate = sau; hid.forEach((c) => { c.visible = true; }); renderer.autoClear = true;
    return;
  }
  // race / countdown / finished
  if (state === 'countdown') {
    const before = Math.ceil(countdown); countdown -= dt;
    const n = Math.ceil(countdown);
    if (n !== before && n > 0) sfx('count');
    el.count.textContent = countdown > 0.6 ? String(Math.ceil(countdown - 0.6)) : 'GO!';
    if (countdown <= 0.6) { state = 'racing'; sfx('go'); goT = 0.7; }
  } else if (goT > 0) { goT -= dt; if (goT <= 0) el.count.hidden = true; }
  if (state === 'racing') {
    raceTime += dt;
    mood.turboT = Math.max(0, mood.turboT - dt); mood.stumbleT = Math.max(0, mood.stumbleT - dt);
    mood.scrambleFlash = Math.max(0, mood.scrambleFlash - dt); errFlash = Math.max(0, errFlash - dt);
    mood.attackT -= dt;
    const fx = items, fogWas = fx.fogT > 0;
    fx.nitroT = Math.max(0, fx.nitroT - dt); fx.magnetT = Math.max(0, fx.magnetT - dt); fx.freezeT = Math.max(0, fx.freezeT - dt); fx.fogT = Math.max(0, fx.fogT - dt);
    if (fx.tripleN > 0) { fx.tripleT -= dt; if (fx.tripleT <= 0) { mood.turboT = Math.max(mood.turboT, 1.4); fx.tripleN--; fx.tripleT = 3.2; toast('Turbo burst' + (fx.tripleN ? ' (' + fx.tripleN + ' left)' : ''), '#ffd23f'); sfx('turbo'); } }
    if (fogWas && fx.fogT <= 0) renderText();
    if (mood.attackT <= 0) {
      mood.attackT = 14 + Math.random() * 10;
      const who = pick(racers.filter((r) => !r.isPlayer));
      hitPlayer('scramble', who);
    }
  }
  if (state === 'finished') { player.speed += (14 - player.speed) * Math.min(1, dt); }
  renderer.toneMappingExposure = 1;
  for (const r of racers) updateRacer(r, dt, tAcc);
  if (state === 'racing' && player.finished) {
    toast('FINISH!', '#ff8a3d'); state = 'finished';
    setTimeout(() => { if (state === 'finished') showResults(); }, 1400);
  }
  if (toastT > 0) { toastT -= dt; if (toastT <= 0) el.toast.className = 'toast'; }
  if (state === 'racing') updateItemBoxes(dt, tAcc); else for (const b of itemBoxes) { b.mesh.rotation.y = tAcc * 1.6 + b.ph; }
  updateCamera(dt);
  if (hudTick++ % 2 === 0) updateHud();
  if (errFlash === 0 && hudTick % 6 === 0 && state === 'racing') renderText();
  engineUpdate();
  updateWeather(dt, tAcc, raceCamera.position);
  renderer.setViewport(viewport.x, viewport.y, viewport.w, viewport.h);
  renderer.render(raceScene, raceCamera);
}
let hudTick = 0, goT = 0, lastLap = 1;

/* ------------------------------------------------------------------ boot */
async function boot() {
  cacheEls();
  const defs = { straight: gStraight, corner: gCorner, finish: gFinish, forest: gForest, empty: gEmpty };
  RIDES.forEach((r) => { defs[r.id] = r.glb; });
  Object.assign(defs, NATURE_GLB, CITY_GLB, IND_GLB, COM_GLB, SPACE_GLB, HEXBOAT_GLB, PROP_GLB, GP_GLB);
  for (const key of Object.keys(defs)) { const rd = RIDES.find((r) => r.id === key); texUrl = key.startsWith('c_') ? cityTex : key.startsWith('i_') ? indTex : key.startsWith('m_') ? comTex : key.startsWith('b_') || (rd && rd.tex === 'boat') ? boatTex : (rd && rd.tex === 'car') || key.startsWith('k_') ? carTex : colormapUrl; models[key] = await parseGlb(defs[key]); }
  buildGarageWorld();
  initLights();
  buildRaceWorld();
  RIDES.forEach((r) => { const v = makeVehicle(r); v.group.visible = false; garageScene.add(v.group); garageModels[r.id] = v; });
  buildGarageUI();
  buildSetupUI();
  state = 'profile';
  showScreen('profile');
  let savedRide = null; try { savedRide = (JSON.parse(localStorage.getItem('turbotype-setup')) || {}).ride; } catch (e) { savedRide = null; }
  selectRide(RIDES.find((r) => r.id === savedRide) || RIDES[0]);
  layout();
  try { renderThumbs(); } catch (e) { /* thumbnails are optional */ }
  el.loading.hidden = true;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => layout());
  // name + avatar page (saved on this device)
  {
    let pr = null; try { pr = JSON.parse(localStorage.getItem('turbotype-player')); } catch (e) { pr = null; }
    profile = pr || { name: '', av: Math.floor(Math.random() * AVS.length) };
    const nm = $('pName'), row = $('avRow');
    const save = () => { try { localStorage.setItem('turbotype-player', JSON.stringify(profile)); } catch (e) { /* ignore */ } };
    row.innerHTML = AVS.map((e, i) => '<button type="button" class="at" data-i="' + i + '" style="left:' + i * 66 + 'px;background:' + BGS[i] + '" aria-label="Avatar ' + (i + 1) + '">' + e + '</button>').join('');
    const paint = () => [...row.children].forEach((b, i) => b.classList.toggle('s', i === profile.av));
    [...row.children].forEach((b, i) => b.addEventListener('click', () => { profile.av = i; paint(); save(); }));
    nm.value = profile.name; paint();
    nm.addEventListener('input', () => { profile.name = nm.value.replace(/[^\w \-.']/g, '').slice(0, 12); save(); });
    nm.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') $('goBtn').click(); });
    $('goBtn').addEventListener('click', () => { audioStart(); toGaragePage(); });
    { // join a room with a code
      const jm = $('joinModal'), jc = $('jCode'), je = $('jErr');
      const fmt = () => { const v = jc.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7); jc.value = v.length > 4 ? v.slice(0, 4) + '-' + v.slice(4) : v; je.textContent = ''; };
      const go = () => {
        const v = jc.value.replace('-', '');
        if (v.length < 7) { je.textContent = 'Enter the 7-character code'; return; }
        if (closedRooms.has(jc.value)) { je.textContent = 'That race already started. Ask for a new code.'; return; }
        jm.hidden = true; audioStart(); toGaragePage(jc.value, true);
      };
      $('codeBtn').addEventListener('click', () => { jm.hidden = false; jc.value = ''; je.textContent = ''; setTimeout(() => jc.focus(), 30); });
      jc.addEventListener('input', fmt); jc.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') go(); if (e.key === 'Escape') jm.hidden = true; });
      $('jGo').addEventListener('click', go); $('jX').addEventListener('click', () => { jm.hidden = true; });
    }
    $('backBtn').addEventListener('click', () => { closeRoomTimer(); room = null; state = 'profile'; showScreen('profile'); });
    window.__player = () => ({ name: me().name, av: me().av });
  }
  updateSum();
  $('startBtn').addEventListener('click', () => { audioStart(); if (!room) { startRace(); return; } room.ready = !room.ready; renderRideCards(); roomTick(); });
  $('rcCopy').addEventListener('click', () => { const b = $('rcCopy'); try { navigator.clipboard.writeText(room ? room.code : ''); } catch (e) { /* ignore */ } b.textContent = 'COPIED'; setTimeout(() => { b.textContent = 'COPY'; }, 1200); });
  $('againBtn').addEventListener('click', () => { audioStart(); startRace(); });
  $('garageBtn').addEventListener('click', toGarage);
  $('quitBtn').addEventListener('click', toGarage);
  $('muteBtn').addEventListener('click', () => { muted = !muted; $('muteWaves').style.display = muted ? 'none' : ''; $('muteBtn').setAttribute('aria-pressed', muted ? 'true' : 'false'); });
  window.addEventListener('keydown', onKey);
  if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(el.panel);
  window.__tt = { cells: () => CELLS.map((c) => [...cellCenter(c), ...c.d, c.corner ? 1 : 0]), get state() { return state; }, get player() { return player; }, get racers() { return racers; }, get cur() { return cur; }, finishNow() { player.dist = LAPS * TRACK_LEN + 1; }, dbg: { hit: (k) => hitPlayer(k, racers[1]), give: (k) => giveItem(k, "Test: "), fxState: () => JSON.stringify(items), curWords: () => cur.words.slice(cur.wi, cur.wi + 6).map((w) => w.t + (w.mode ? ":" + w.mode : "")).join(" "), pts: () => PTS.slice(), path() { const g = new THREE.BufferGeometry().setFromPoints(PTS.map((q) => new THREE.Vector3(q.x, q.y + 0.6, q.z))); const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xff00ff })); raceScene.add(l); const m = new THREE.Mesh(new THREE.SphereGeometry(0.8), new THREE.MeshBasicMaterial({ color: 0x0000ff })); m.position.set(PTS[0].x, 1, PTS[0].z); raceScene.add(m); }, grant: grantItem, scramble: () => scrambleNext(3), use: useItem, items: () => items, boxes: () => itemBoxes, fogOff() { if (raceScene.fog) { raceScene.fog.near = 1e4; raceScene.fog.far = 1e5; } } }, track: { len: () => TRACK_LEN, cum: () => CUM.slice(), pts: () => PTS.slice() }, spin(v) { garageSpin = v; garageIdle = 1e6; }, readyAll() { if (room) { room.members.forEach((x) => { x.joined = x.picked = x.voted = x.ready = true; }); room.ready = true; roomTick(); } }, get room() { return room; }, setup(m, w) { selectMap(MAPS.find((x) => x.id === m), true); selectWeather(w || WX, true); } };
  requestAnimationFrame(frame);
}
boot().catch((e) => { const l = $('loading'); if (l) { l.textContent = 'Could not start the game: ' + (e && e.message ? e.message : e); } console.error(e); });
