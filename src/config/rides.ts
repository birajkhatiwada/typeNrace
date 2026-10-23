// @ts-nocheck
import gRed from '../assets/vehicle-truck-red.glb';
import gYellow from '../assets/vehicle-truck-yellow.glb';
import gGreen from '../assets/vehicle-truck-green.glb';
import gPurple from '../assets/vehicle-truck-purple.glb';
import gBike from '../assets/vehicle-motorcycle.glb';
import k_race from '../assets/cars/race.glb';
import k_future from '../assets/cars/race-future.glb';
import k_viper from '../assets/cars/sedan-sports.glb';
import k_hatch from '../assets/cars/hatchback-sports.glb';
import k_taxi from '../assets/cars/taxi.glb';
import k_police from '../assets/cars/police.glb';
import k_luxe from '../assets/cars/suv-luxury.glb';
import k_medic from '../assets/cars/ambulance.glb';
import k_fire from '../assets/cars/firetruck.glb';
import b_boat_speed_a from '../assets/boat/boat-speed-a.glb';
import b_boat_speed_d from '../assets/boat/boat-speed-d.glb';
import b_boat_speed_f from '../assets/boat/boat-speed-f.glb';
import b_boat_speed_h from '../assets/boat/boat-speed-h.glb';
import b_boat_speed_j from '../assets/boat/boat-speed-j.glb';
import b_boat_tug_a from '../assets/boat/boat-tug-a.glb';
import b_boat_sail_a from '../assets/boat/boat-sail-a.glb';
import k_kart from '../assets/cars/kart-oobi.glb';
import n_roadster from '../assets/new/roadster.glb';
import n_gt from '../assets/new/gt.glb';
import n_muscle from '../assets/new/muscle.glb';
import n_stripe from '../assets/new/stripe.glb';
import n_crusher from '../assets/new/crusher.glb';
import n_pickup from '../assets/new/pickup.glb';
import n_block from '../assets/new/block.glb';
import n_cube from '../assets/new/cube.glb';
import n_hauler from '../assets/new/hauler.glb';
import n_bmx from '../assets/new/bmx.glb';
import n_trail from '../assets/new/trail.glb';
import n_plane from '../assets/new/plane.glb';

export const RIDES = [
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
  { id: 'roadster', name: 'Azure Roadster', kind: 'Sports', glb: n_roadster, tex: 'own', color: '#2a3cc4', trait: 'Open-top and nimble. Great in the bends.', speed: 4, handling: 4, boost: 2 },
  { id: 'gt', name: 'Crimson GT', kind: 'Sports', glb: n_gt, tex: 'own', color: '#c42a2a', trait: 'Balanced grand tourer with a strong top end.', speed: 4, handling: 3, boost: 3 },
  { id: 'muscle', name: 'Lemon Muscle', kind: 'Sports', glb: n_muscle, tex: 'own', color: '#f5e033', trait: 'All engine. Hard to steer, impossible to catch.', speed: 5, handling: 2, boost: 2 },
  { id: 'stripe', name: 'Stripe Muscle', kind: 'Sports', glb: n_stripe, tex: 'own', color: '#7a8aa8', trait: 'Classic stripes, steady grip, quiet turbo.', speed: 4, handling: 3, boost: 3 },
  { id: 'crusher', name: 'Crusher', kind: 'Truck', glb: n_crusher, tex: 'own', color: '#2a56c4', trait: 'Monster wheels. Shrugs off typos, slow to build speed.', speed: 2, handling: 3, boost: 5 },
  { id: 'pickup', name: 'Forest Pickup', kind: 'Truck', glb: n_pickup, tex: 'own', color: '#2f5a3a', trait: 'Dependable workhorse. Turbo fills quickly.', speed: 3, handling: 3, boost: 4 },
  { id: 'block', name: 'Brick Red', kind: 'Sedan', glb: n_block, tex: 'own', color: '#e04545', trait: 'Boxy and cheerful. Forgiving in corners.', speed: 2, handling: 4, boost: 3 },
  { id: 'cube', name: 'Cube Blue', kind: 'Sedan', glb: n_cube, tex: 'own', color: '#3a96ff', trait: 'Light and tidy. Very easy to control.', speed: 3, handling: 5, boost: 2 },
  { id: 'hauler', name: 'Rust Hauler', kind: 'Truck', glb: n_hauler, tex: 'own', color: '#c0532c', trait: 'Slow but tough. Big turbo for late sprints.', speed: 2, handling: 3, boost: 5 },
  { id: 'bmx', name: 'BMX Rocket', kind: 'Bike', glb: n_bmx, tex: 'own', color: '#ff3b3b', trait: 'Tiny and fast to turn. Weak turbo.', speed: 3, handling: 5, boost: 2 },
  { id: 'trail', name: 'Trail Biker', kind: 'Bike', glb: n_trail, tex: 'own', color: '#f2b82a', trait: 'Quick and light, rewards clean typing.', speed: 4, handling: 4, boost: 2 },
  { id: 'plane', name: 'Sky Racer', kind: 'Plane', glb: n_plane, tex: 'own', color: '#2a3cc4', trait: 'Skims above the track. Fast and floaty.', speed: 5, handling: 3, boost: 3 },
  { id: 'kart', name: 'Oobi Kart', kind: 'Kart', glb: k_kart, tex: 'car', color: '#ffb4ec', trait: 'Tiny and twitchy. Quick turn-in, light turbo.', speed: 3, handling: 5, boost: 2 }
];

export const RIVALS = [
  { name: 'Mira', wpm: 50, color: '#d0583b', av: '\ud83e\udd8a', pref: ['race', 'viper', 'sun', 'ember', 'moss', 'plum', 'bolt'] },
  { name: 'Pip', wpm: 44, color: '#3f9a3b', av: '\ud83d\udc38', pref: ['bolt', 'kart', 'hatch', 'moss', 'plum', 'ember', 'sun'] },
  { name: 'Jonas', wpm: 38, color: '#2a9aa8', av: '\ud83d\udc19', pref: ['police', 'taxi', 'plum', 'sun', 'ember', 'moss', 'bolt'] }
];

