import { prisma } from "../utils/prismaClient.js"
import ErgastClient from "ergast-client"
import dotenv from "dotenv"
dotenv.config()

// Initializing Ergast Client
const ergast = new ErgastClient();

// Get Drivers for a specific year
export const getDrivers = async (req, res) => {
    try {
        let drivers

        // Find drivers in the database
        drivers = await prisma.driver.findUnique({
            where: {
                year: Number(req?.body?.year)
            },
            select: {
                drivers: true
            }
        })

        // If database entry is not present, fetch from the API
        if (!drivers) {
            drivers = await new Promise(async (resolve, reject) => {
                ergast.getDrivers(req?.body?.year, function (err, drivers) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (driver?.drivers) {
                        resolve(drivers.drivers)
                    } else {
                        reject("Data unavailable")
                    }
                });
            })

            // Create the object
            drivers = await prisma.driver.create({
                data: {
                    year: Number(req?.body?.year),
                    drivers: drivers
                },
                select: {
                    drivers: true
                }
            })

        }

        // Return the year and the drivers
        return res.status(200).send({ drivers: { year: req?.body?.year, drivers } })

    } catch (err) {
        console.log(err)

        if (err == "Data unavailable") {
            return res.status(404).send({ data: "Data unavailable." })
        }

        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Constructors for a specific year
export const getConstructors = async (req, res) => {
    try {

        let constructors

        // Find constructors in database
        constructors = await prisma.constructor.findUnique({
            where: {
                year: Number(req?.body?.year)
            }, select: {
                constructors: true
            }
        })

        // If database entry does not exist, fetch from API
        if (!constructors) {
            constructors = await new Promise(async (resolve, reject) => {
                ergast.getConstructors(req?.body?.year, function (err, constructors) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (constructors?.constructors) {
                        resolve(constructors.constructors)
                    } else {
                        reject("Data unavailable")
                    }
                });
            })

            // Create Object in DB
            constructors = await prisma.constructor.create({
                data: {
                    year: Number(req?.body?.year),
                    constructors: constructors
                },
                select: {
                    constructors: true
                }
            })
        }

        // Return the year and the constructors
        return res.status(200).send({ constructors: { year: req?.body?.year, constructors } })

    } catch (err) {
        console.log(err)

        if (err == "Data unavailable") {
            return res.status(404).send({ data: "Data unavailable." })
        }

        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Circuits for a specific year
export const getCircuits = async (req, res) => {
    try {
        let circuits

        // Find circuits in DB
        circuits = await prisma.circuit.findUnique({
            where: {
                year: Number(req?.body?.year)
            },
            select: {
                circuits: true
            }
        })

        // If not present in DB, fetch from API.
        if (!circuits) {
            circuits = await new Promise(async (resolve, reject) => {
                ergast.getCircuits(req?.body?.year, function (err, circuits) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (circuits?.circuits) {
                        resolve(circuits.circuits)
                    } else {
                        reject("Data unavailable")
                    }

                });
            })

            // Create the object in DB
            circuits = await prisma.circuit.create({
                data: {
                    year: Number(req?.body?.year),
                    circuits: circuits
                },
                select: {
                    circuits: true
                }
            })
        }

        // Return the year and the circuits
        return res.status(200).send({ circuits: { year: req?.body?.year, circuits: circuits } })

    } catch (err) {
        console.log(err)

        if (err == "Data unavailable") {
            return res.status(404).send({ data: "Data unavailable." })
        }

        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Race Schedule for a specific year
export const getSchedule = async (req, res) => {
    try {
        let schedule

        // Find the schedule in database
        schedule = await prisma.schedule.findUnique({
            where: {
                year: Number(req?.body?.year)
            },
            select: {
                raceschedule: true
            }
        })

        // If not present in DB, fetch from API
        if (!schedule) {
            schedule = await new Promise(async (resolve, reject) => {
                ergast.getSeason(req?.body?.year, function (err, season) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (season?.races) {
                        resolve(season.races)
                    } else {
                        reject("Data unavailable")
                    }

                });
            })

            // Create the object in db
            schedule = await prisma.schedule.create({
                data: {
                    year: Number(req?.body?.year),
                    raceschedule: schedule
                },
                select: {
                    raceschedule: true
                }
            })
        }

        // Return the schedule and the year
        return res.status(200).send({ schedule: { year: req?.body?.year, schedule: schedule } })

    } catch (err) {
        console.log(err)

        if (err == "Data unavailable") {
            return res.status(404).send({ data: "Data unavailable." })
        }

        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Driver Standings for a specific year
export const getDriverStandings = async (req, res) => {
    try {
        let standings

        // Not current year (standings can be saved as they wont change)
        if (req?.body?.year != new Date().getFullYear()) {
            // Find the standings in the database
            standings = await prisma.driverstandings.findUnique({
                where: {
                    year: Number(req?.body?.year)
                },
                select: {
                    standings: true
                }
            })

            // If standings are not present in db, fetch from api.
            if (!standings) {
                standings = await new Promise(async (resolve, reject) => {
                    ergast.getDriverStandings(req?.body?.year, function (err, standings) {
                        if (err) {
                            reject("Data unavailable")
                        }

                        if (standings?.standings) {
                            resolve(standings.standings)
                        } else {
                            reject("Data unavailable")
                        }
                    });
                })

                // Create the object in db
                standings = await prisma.driverstandings.create({
                    data: {
                        year: Number(req?.body?.year),
                        standings: standings
                    },
                    select: {
                        standings: true
                    }
                })
            }

            // Return the year and the standings
            return res.status(200).send({ standings: { year: req?.body?.year, standings: standings } })
        }
        // For current year, standings cannot be stored as they can change
        else {
            standings = await new Promise(async (resolve, reject) => {
                ergast.getDriverStandings(req?.body?.year, function (err, standings) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (standings?.standings) {
                        resolve(standings.standings)
                    } else {
                        reject("Data unavailable")
                    }
                });
            })

            return res.status(200).send({ standings: { year: req?.body?.year, standings: { standings } } })
        }



    } catch (err) {
        console.log(err)

        if (err == "Data unavailable") {
            return res.status(404).send({ data: "Data unavailable." })
        }

        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Constructor Standings for a specific year
export const getConstructorStandings = async (req, res) => {
    try {
        let standings

        // Not current year (standings can be saved as they wont change)
        if (req?.body?.year != new Date().getFullYear()) {
            // Find the standings in the database
            standings = await prisma.constructorstandings.findUnique({
                where: {
                    year: Number(req?.body?.year)
                },
                select: {
                    standings: true
                }
            })

            // If standings are not present in db, fetch from api.
            if (!standings) {
                standings = await new Promise(async (resolve, reject) => {
                    ergast.getConstructorStandings(req?.body?.year, function (err, standings) {
                        if (err) {
                            reject("Data unavailable")
                        }

                        if (standings?.standings) {
                            resolve(standings.standings)
                        } else {
                            reject("Data unavailable")
                        }
                    });
                })

                // Create the object in DB
                standings = await prisma.constructorstandings.create({
                    data: {
                        year: Number(req?.body?.year),
                        standings: standings
                    },
                    select: {
                        standings: true
                    }
                })

            }

            // Return the year and the standings
            return res.status(200).send({ standings: { year: req?.body?.year, standings: standings } })
        } else {
            standings = await new Promise(async (resolve, reject) => {
                ergast.getConstructorStandings(req?.body?.year, function (err, standings) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (standings?.standings) {
                        resolve(standings.standings)
                    } else {
                        reject("Data unavailable")
                    }
                });
            })

            return res.status(200).send({ standings: { year: req?.body?.year, standings: { standings } } })
        }

    } catch (err) {
        console.log(err)

        if (err == "Data unavailable") {
            return res.status(404).send({ data: "Data unavailable." })
        }

        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Race Result for a specific year
export const getRaceResult = async (req, res) => {
    try {
        let result

        // Find the result in the database
        result = await prisma.raceResult.findFirst({
            where: {
                year: Number(req?.body?.year),
                round: Number(req?.body?.round)
            }
        })

        // If not present in DB, fetch from API.
        if (!result) {
            result = await new Promise(async (resolve, reject) => {
                ergast.getRaceResults(req?.body?.year, req?.body?.round, function (err, race) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (race?.driverResults) {
                        resolve(race.driverResults)
                    } else {
                        reject("Data unavailable")
                    }
                });
            })

            // Create the object in DB
            result = await prisma.raceResult.create({
                data: {
                    year: Number(req?.body?.year),
                    round: Number(req?.body?.round),
                    result: result
                }
            })
        }

        // Return the year and the result
        return res.status(200).send({ result: { year: req?.body?.year, round: req?.body?.round, result: result } })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ data: "Something went wrong." })
    }
}

// Get Race Result for a specific year
export const getQualifyingResult = async (req, res) => {
    try {
        let result

        // Find the result in DB
        result = await prisma.qualifyingresult.findFirst({
            where: {
                year: Number(req?.body?.year),
                round: Number(req?.body?.round)
            }
        })

        // If result is not in DB, fetch from API
        if (!result) {
            result = await new Promise(async (resolve, reject) => {
                ergast.getQualifyingResults(req?.body?.year, req?.body?.round, function (err, race) {
                    if (err) {
                        reject("Data unavailable")
                    }

                    if (race?.driverQualifyingResults) {
                        resolve(race.driverQualifyingResults)
                    } else {
                        reject("Data unavailable")
                    }
                });
            })

            // Create the object
            result = await prisma.qualifyingresult.create({
                data: {
                    year: Number(req?.body?.year),
                    round: Number(req?.body?.round),
                    result: result
                }
            })

        }

        // Return the result and the year
        return res.status(200).send({ result: { year: req?.body?.year, round: req?.body?.round, result: result } })

    } catch (err) {
        console.log(err)

        if (err == "Data unavailable") {
            return res.status(404).send({ data: "Data unavailable." })
        }

        return res.status(500).send({ data: "Something went wrong." })
    }
}