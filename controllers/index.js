import { prisma } from "../utils/prismaClient.js"
import ErgastClient from "ergast-client"

// Initializing Ergast Client
const ergast = new ErgastClient();

// Get Drivers for a specific year
export const getDrivers = async (req, res) => {
    try {
        let drivers

        drivers = await prisma.driver.findUnique({
            where: {
                year: Number(req?.body?.year)
            }
        })

        if (!drivers) {
            drivers = await new Promise(async (resolve, reject) => {
                ergast.getDrivers(req?.body?.year, function (err, drivers) {
                    resolve(drivers.drivers)
                });
            })

            await prisma.driver.create({
                data: {
                    year: Number(req?.body?.year),
                    drivers: drivers
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ drivers: { year: req?.body?.year, drivers } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Constructors for a specific year
export const getConstructors = async (req, res) => {
    try {

        let constructors

        constructors = await prisma.constructor.findUnique({
            where: {
                year: Number(req?.body?.year)
            }
        })

        if (!constructors) {
            constructors = await new Promise(async (resolve, reject) => {
                ergast.getConstructors(req?.body?.year, function (err, constructors) {
                    resolve(constructors.constructors)
                });
            })

            await prisma.constructor.create({
                data: {
                    year: Number(req?.body?.year),
                    constructors: constructors
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ constructors: { year: req?.body?.year, constructors } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Driver Standings for a specific year
export const getDriverStandings = async (req, res) => {
    try {
        let standings

        standings = await prisma.driverstandings.findUnique({
            where: {
                year: Number(req?.body?.year)
            }
        })

        if (!standings) {
            standings = await new Promise(async (resolve, reject) => {
                ergast.getDriverStandings(req?.body?.year, function (err, standings) {
                    resolve(standings.standings)
                });
            })

            await prisma.driverstandings.create({
                data: {
                    year: Number(req?.body?.year),
                    standings: standings
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ standings: { year: req?.body?.year, standings: standings } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Constructor Standings for a specific year
export const getConstructorStandings = async (req, res) => {
    try {
        let standings

        standings = await prisma.constructorstandings.findUnique({
            where: {
                year: Number(req?.body?.year)
            }
        })

        if (!standings) {
            standings = await new Promise(async (resolve, reject) => {
                ergast.getConstructorStandings(req?.body?.year, function (err, standings) {
                    resolve(standings.standings)
                });
            })

            await prisma.constructorstandings.create({
                data: {
                    year: Number(req?.body?.year),
                    standings: standings
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ standings: { year: req?.body?.year, standings: standings } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Circuits for a specific year
export const getCircuits = async (req, res) => {
    try {
        let circuits

        circuits = await prisma.circuit.findUnique({
            where: {
                year: Number(req?.body?.year)
            }
        })

        if (!circuits) {
            circuits = await new Promise(async (resolve, reject) => {
                ergast.getCircuits(req?.body?.year, function (err, circuits) {
                    resolve(circuits.circuits)
                });
            })

            await prisma.circuit.create({
                data: {
                    year: Number(req?.body?.year),
                    circuits: circuits
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ circuits: { year: req?.body?.year, circuits: circuits } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Race Schedule for a specific year
export const getSchedule = async (req, res) => {
    try {
        let schedule

        schedule = await prisma.schedule.findUnique({
            where: {
                year: Number(req?.body?.year)
            }
        })

        if (!schedule) {
            schedule = await new Promise(async (resolve, reject) => {
                ergast.getSeason(req?.body?.year, function (err, season) {
                    resolve(season.races)
                });
            })

            await prisma.schedule.create({
                data: {
                    year: Number(req?.body?.year),
                    raceschedule: schedule
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ schedule: { year: req?.body?.year, schedule: schedule } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Race Result for a specific year
export const getRaceResult = async (req, res) => {
    try {
        let result

        result = await prisma.raceResult.findFirst({
            where: {
                year: Number(req?.body?.year),
                round: Number(req?.body?.round)
            }
        })

        if (!result) {
            result = await new Promise(async (resolve, reject) => {
                ergast.getRaceResults(req?.body?.year, req?.body?.round, function (err, race) {
                    resolve(race.driverResults)
                });
            })

            await prisma.raceResult.create({
                data: {
                    year: Number(req?.body?.year),
                    round: Number(req?.body?.round),
                    result: result
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ result: { year: req?.body?.year, result: result } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Race Result for a specific year
export const getQualifyingResult = async (req, res) => {
    try {
        let result

        result = await prisma.qualifyingresult.findFirst({
            where: {
                year: Number(req?.body?.year),
                round: Number(req?.body?.round)
            }
        })

        if (!result) {
            result = await new Promise(async (resolve, reject) => {
                ergast.getQualifyingResults(req?.body?.year, req?.body?.round, function (err, race) {
                    resolve(race.driverQualifyingResults)
                });
            })

            await prisma.qualifyingresult.create({
                data: {
                    year: Number(req?.body?.year),
                    round: Number(req?.body?.round),
                    result: result
                }
            })

            console.log("From API")
        }
        else {
            console.log("From DB")
        }

        return res.status(200).send({ result: { year: req?.body?.year, result: result } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}