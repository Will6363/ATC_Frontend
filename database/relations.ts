import { relations } from "drizzle-orm/relations";
import { manufacturers, models, airspaces, rnavAids, airports, runways, taxiways, carriers, aircrafts, engines, taxiwaysRunways, taxiwaysTaxiways, runwaysRunways } from "./schema";

export const modelsRelations = relations(models, ({one, many}) => ({
	manufacturer: one(manufacturers, {
		fields: [models.manufacturer],
		references: [manufacturers.manufacturerId]
	}),
	aircrafts: many(aircrafts),
}));

export const manufacturersRelations = relations(manufacturers, ({many}) => ({
	models: many(models),
}));

export const rnavAidsRelations = relations(rnavAids, ({one}) => ({
	airspace: one(airspaces, {
		fields: [rnavAids.airspace],
		references: [airspaces.airspaceId]
	}),
}));

export const airspacesRelations = relations(airspaces, ({many}) => ({
	rnavAids: many(rnavAids),
}));

export const runwaysRelations = relations(runways, ({one, many}) => ({
	airport: one(airports, {
		fields: [runways.airport],
		references: [airports.icao]
	}),
	taxiwaysRunways: many(taxiwaysRunways),
	runwaysRunways_runwayNumberA: many(runwaysRunways, {
		relationName: "runwaysRunways_runwayNumberA_runways_number"
	}),
	runwaysRunways_runwayNumberB: many(runwaysRunways, {
		relationName: "runwaysRunways_runwayNumberB_runways_number"
	}),
}));

export const airportsRelations = relations(airports, ({many}) => ({
	runways: many(runways),
	taxiways: many(taxiways),
}));

export const taxiwaysRelations = relations(taxiways, ({one, many}) => ({
	airport: one(airports, {
		fields: [taxiways.airport],
		references: [airports.icao]
	}),
	taxiwaysRunways: many(taxiwaysRunways),
	taxiwaysTaxiways_taxiwaysNameA: many(taxiwaysTaxiways, {
		relationName: "taxiwaysTaxiways_taxiwaysNameA_taxiways_airport"
	}),
	taxiwaysTaxiways_taxiwaysNameB: many(taxiwaysTaxiways, {
		relationName: "taxiwaysTaxiways_taxiwaysNameB_taxiways_airport"
	}),
}));

export const aircraftsRelations = relations(aircrafts, ({one}) => ({
	carrier: one(carriers, {
		fields: [aircrafts.carrier],
		references: [carriers.name]
	}),
	model: one(models, {
		fields: [aircrafts.model],
		references: [models.base]
	}),
	engine: one(engines, {
		fields: [aircrafts.engine],
		references: [engines.name]
	}),
}));

export const carriersRelations = relations(carriers, ({many}) => ({
	aircrafts: many(aircrafts),
}));

export const enginesRelations = relations(engines, ({many}) => ({
	aircrafts: many(aircrafts),
}));

export const taxiwaysRunwaysRelations = relations(taxiwaysRunways, ({one}) => ({
	taxiway: one(taxiways, {
		fields: [taxiwaysRunways.taxiwayName],
		references: [taxiways.airport]
	}),
	runway: one(runways, {
		fields: [taxiwaysRunways.runwayNumber],
		references: [runways.number]
	}),
}));

export const taxiwaysTaxiwaysRelations = relations(taxiwaysTaxiways, ({one}) => ({
	taxiway_taxiwaysNameA: one(taxiways, {
		fields: [taxiwaysTaxiways.taxiwaysNameA],
		references: [taxiways.airport],
		relationName: "taxiwaysTaxiways_taxiwaysNameA_taxiways_airport"
	}),
	taxiway_taxiwaysNameB: one(taxiways, {
		fields: [taxiwaysTaxiways.taxiwaysNameB],
		references: [taxiways.airport],
		relationName: "taxiwaysTaxiways_taxiwaysNameB_taxiways_airport"
	}),
}));

export const runwaysRunwaysRelations = relations(runwaysRunways, ({one}) => ({
	runway_runwayNumberA: one(runways, {
		fields: [runwaysRunways.runwayNumberA],
		references: [runways.number],
		relationName: "runwaysRunways_runwayNumberA_runways_number"
	}),
	runway_runwayNumberB: one(runways, {
		fields: [runwaysRunways.runwayNumberB],
		references: [runways.number],
		relationName: "runwaysRunways_runwayNumberB_runways_number"
	}),
}));