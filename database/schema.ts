import { pgTable, check, varchar, foreignKey, smallint, integer, point, doublePrecision, char, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const manufacturers = pgTable("manufacturers", {
	manufacturerId: varchar("manufacturer_id", { length: 32 }).notNull(),
	name: varchar({ length: 32 }).notNull(),
}, (table) => {
	return {
		manufacturersManufacturerIdNotNull: check("manufacturers_manufacturer_id_not_null", sql`NOT NULL manufacturer_id`),
		manufacturersNameNotNull: check("manufacturers_name_not_null", sql`NOT NULL name`),
	}
});

export const models = pgTable("models", {
	base: varchar({ length: 32 }).notNull(),
	variant: varchar({ length: 32 }).notNull(),
	manufacturer: varchar({ length: 32 }).notNull(),
	length: smallint().notNull(),
	wingspan: smallint().notNull(),
	numberOfEngines: smallint("number_of_engines").notNull(),
}, (table) => {
	return {
		modelManufacturerFkey: foreignKey({
			columns: [table.manufacturer],
			foreignColumns: [manufacturers.manufacturerId],
			name: "model_manufacturer_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		modelsBaseNotNull: check("models_base_not_null", sql`NOT NULL base`),
		modelsVariantNotNull: check("models_variant_not_null", sql`NOT NULL variant`),
		modelsManufacturerNotNull: check("models_manufacturer_not_null", sql`NOT NULL manufacturer`),
		modelsLengthNotNull: check("models_length_not_null", sql`NOT NULL length`),
		modelsWingspanNotNull: check("models_wingspan_not_null", sql`NOT NULL wingspan`),
		modelsNumberOfEnginesNotNull: check("models_number_of_engines_not_null", sql`NOT NULL number_of_engines`),
	}
});

export const airspaces = pgTable("airspaces", {
	name: varchar({ length: 32 }).notNull(),
	maxHeight: integer("max_height"),
	minHeight: integer("min_height"),
	pointOne: point("point_one"),
	pointTwo: point("point_two"),
	pointThree: point("point_three"),
	pointFour: point("point_four"),
	airspaceId: varchar("airspace_id", { length: 32 }).notNull(),
}, (table) => {
	return {
		airspacesNameNotNull: check("airspaces_name_not_null", sql`NOT NULL name`),
		airspacesAirspaceIdNotNull: check("airspaces_airspace_id_not_null", sql`NOT NULL airspace_id`),
	}
});

export const rnavAids = pgTable("rnav_aids", {
	name: varchar({ length: 32 }).notNull(),
	frequency: doublePrecision().notNull(),
	coordinate: point().notNull(),
	airspace: varchar({ length: 32 }).notNull(),
	rnavAidId: varchar("rnav_aid_id", { length: 32 }).notNull(),
}, (table) => {
	return {
		rnavAirspaceFkey: foreignKey({
			columns: [table.airspace],
			foreignColumns: [airspaces.airspaceId],
			name: "RNAV_Airspace_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		rnavAidsNameNotNull: check("rnav_aids_name_not_null", sql`NOT NULL name`),
		rnavAidsFrequencyNotNull: check("rnav_aids_frequency_not_null", sql`NOT NULL frequency`),
		rnavAidsCoordinateNotNull: check("rnav_aids_coordinate_not_null", sql`NOT NULL coordinate`),
		rnavAidsAirspaceNotNull: check("rnav_aids_airspace_not_null", sql`NOT NULL airspace`),
		rnavAidsRnavAidIdNotNull: check("rnav_aids_rnav_aid_id_not_null", sql`NOT NULL rnav_aid_id`),
	}
});

export const airports = pgTable("airports", {
	icao: char({ length: 4 }).notNull(),
	iata: char({ length: 3 }),
	coordinates: point(),
}, (table) => {
	return {
		airportsIcaoNotNull: check("airports_icao_not_null", sql`NOT NULL icao`),
	}
});

export const runways = pgTable("runways", {
	number: varchar({ length: 4 }).notNull(),
	airport: char({ length: 4 }).notNull(),
	heading: smallint().notNull(),
	length: smallint().notNull(),
	width: smallint().notNull(),
}, (table) => {
	return {
		runwaysAirportFkey: foreignKey({
			columns: [table.airport],
			foreignColumns: [airports.icao],
			name: "runways_airport_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		runwaysNumberNotNull: check("runways_number_not_null", sql`NOT NULL number`),
		runwaysAirportNotNull: check("runways_airport_not_null", sql`NOT NULL airport`),
		runwaysHeadingNotNull: check("runways_heading_not_null", sql`NOT NULL heading`),
		runwaysLengthNotNull: check("runways_length_not_null", sql`NOT NULL length`),
		runwaysWidthNotNull: check("runways_width_not_null", sql`NOT NULL width`),
	}
});

export const taxiways = pgTable("taxiways", {
	airport: char({ length: 4 }).notNull(),
	name: varchar({ length: 8 }).notNull(),
}, (table) => {
	return {
		taxiwaysAirportFkey: foreignKey({
			columns: [table.airport],
			foreignColumns: [airports.icao],
			name: "taxiways_airport_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		taxiwaysAirportNotNull: check("taxiways_airport_not_null", sql`NOT NULL airport`),
		taxiwaysNameNotNull: check("taxiways_name_not_null", sql`NOT NULL name`),
	}
});

export const carriers = pgTable("carriers", {
	name: varchar({ length: 32 }).notNull(),
	country: varchar({ length: 32 }).notNull(),
	isFlagCarrier: boolean("is_flag_carrier").notNull(),
	airOperatorCertification: integer("air_operator_certification"),
	iata: varchar({ length: 4 }),
	icao: varchar({ length: 4 }),
}, (table) => {
	return {
		carriersNameNotNull: check("carriers_name_not_null", sql`NOT NULL name`),
		carriersCountryNotNull: check("carriers_country_not_null", sql`NOT NULL country`),
		carriersIsFlagCarrierNotNull: check("carriers_is_flag_carrier_not_null", sql`NOT NULL is_flag_carrier`),
	}
});

export const aircrafts = pgTable("aircrafts", {
	aircraftId: varchar("aircraft_id", { length: 8 }).notNull(),
	tailNumber: varchar("tail_number", { length: 8 }).notNull(),
	model: varchar({ length: 32 }).notNull(),
	variant: varchar({ length: 32 }),
	engine: varchar({ length: 16 }).notNull(),
	carrier: varchar({ length: 32 }),
}, (table) => {
	return {
		aircraftsCarriersFkey: foreignKey({
			columns: [table.carrier],
			foreignColumns: [carriers.name],
			name: "aircrafts_carriers_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		baseVariant: foreignKey({
			columns: [table.model, table.variant],
			foreignColumns: [models.base, models.variant],
			name: "base_variant"
		}).onUpdate("cascade").onDelete("cascade"),
		engines: foreignKey({
			columns: [table.engine],
			foreignColumns: [engines.name],
			name: "engines"
		}).onUpdate("cascade").onDelete("cascade"),
		aircraftsAircraftIdNotNull: check("aircrafts_aircraft_id_not_null", sql`NOT NULL aircraft_id`),
		aircraftsTailNumberNotNull: check("aircrafts_tail_number_not_null", sql`NOT NULL tail_number`),
		aircraftsModelNotNull: check("aircrafts_model_not_null", sql`NOT NULL model`),
		aircraftsEngineNotNull: check("aircrafts_engine_not_null", sql`NOT NULL engine`),
	}
});

export const engines = pgTable("engines", {
	name: varchar({ length: 16 }).notNull(),
	manufacturer: varchar({ length: 16 }),
	type: varchar({ length: 16 }),
	fuel: varchar({ length: 16 }),
	weight: integer(),
	thrust: integer(),
}, (table) => {
	return {
		enginesNameNotNull: check("engines_name_not_null", sql`NOT NULL name`),
	}
});

export const taxiwaysRunways = pgTable("taxiways_runways", {
	taxiwayName: varchar("taxiway_name", { length: 8 }).notNull(),
	runwayNumber: varchar("runway_number", { length: 4 }).notNull(),
	airport: char({ length: 4 }).notNull(),
}, (table) => {
	return {
		taxiwaysRunwaysTaxiwayNameAirportFkey: foreignKey({
			columns: [table.taxiwayName, table.airport],
			foreignColumns: [taxiways.airport, taxiways.name],
			name: "taxiways_runways_taxiway_name_airport_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		taxiwaysRunwaysRunwayNumberAirportFkey: foreignKey({
			columns: [table.runwayNumber, table.airport],
			foreignColumns: [runways.number, runways.airport],
			name: "taxiways_runways_runway_number_airport_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		taxiwaysRunwaysTaxiwayNameNotNull: check("taxiways_runways_taxiway_name_not_null", sql`NOT NULL taxiway_name`),
		taxiwaysRunwaysRunwayNumberNotNull: check("taxiways_runways_runway_number_not_null", sql`NOT NULL runway_number`),
		taxiwaysRunwaysAirportNotNull: check("taxiways_runways_airport_not_null", sql`NOT NULL airport`),
	}
});

export const taxiwaysTaxiways = pgTable("taxiways_taxiways", {
	taxiwaysNameA: varchar("taxiways_name_a", { length: 8 }).notNull(),
	taxiwaysNameB: varchar("taxiways_name_b", { length: 8 }).notNull(),
	airport: char({ length: 4 }).notNull(),
}, (table) => {
	return {
		taxiwaysTaxiwaysAirportTaxiwaysNameAFkey: foreignKey({
			columns: [table.taxiwaysNameA, table.airport],
			foreignColumns: [taxiways.airport, taxiways.name],
			name: "taxiways_taxiways_airport_taxiways_name_a_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		taxiwaysTaxiwaysAirportTaxiwaysNameBFkey: foreignKey({
			columns: [table.taxiwaysNameB, table.airport],
			foreignColumns: [taxiways.airport, taxiways.name],
			name: "taxiways_taxiways_airport_taxiways_name_b_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		taxiwaysTaxiwaysTaxiwaysNameANotNull: check("taxiways_taxiways_taxiways_name_a_not_null", sql`NOT NULL taxiways_name_a`),
		taxiwaysTaxiwaysTaxiwaysNameBNotNull: check("taxiways_taxiways_taxiways_name_b_not_null", sql`NOT NULL taxiways_name_b`),
		taxiwaysTaxiwaysAirportNotNull: check("taxiways_taxiways_airport_not_null", sql`NOT NULL airport`),
	}
});

export const runwaysRunways = pgTable("runways_runways", {
	runwayNumberA: varchar("runway_number_a", { length: 4 }).notNull(),
	runwayNumberB: varchar("runway_number_b", { length: 4 }).notNull(),
	airport: char({ length: 4 }).notNull(),
}, (table) => {
	return {
		runwaysRunwaysRunwayNumberAAirportFkey: foreignKey({
			columns: [table.runwayNumberA, table.airport],
			foreignColumns: [runways.number, runways.airport],
			name: "runways_runways_runway_number_a_airport_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		runwaysRunwaysRunwayNumberBAirportFkey: foreignKey({
			columns: [table.runwayNumberB, table.airport],
			foreignColumns: [runways.number, runways.airport],
			name: "runways_runways_runway_number_b_airport_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		runwaysRunwaysRunwayNumberANotNull: check("runways_runways_runway_number_a_not_null", sql`NOT NULL runway_number_a`),
		runwaysRunwaysRunwayNumberBNotNull: check("runways_runways_runway_number_b_not_null", sql`NOT NULL runway_number_b`),
		runwaysRunwaysAirportNotNull: check("runways_runways_airport_not_null", sql`NOT NULL airport`),
	}
});
