import { prisma } from "../utils/prismaClient.ts";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.ts";
import { v4 } from "uuid";
import { redisClient } from "../utils/redis.ts";
import axios from "axios";
import { Request, Response } from "express";
dotenv.config();

// Get Drivers for a specific year
export const getDrivers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let drivers;

    // Find drivers in the database
    drivers = await prisma.driver.findUnique({
      where: {
        year: Number(req?.body?.year),
      },
      select: {
        drivers: true,
      },
    });

    // If database entry is not present, fetch from the API
    if (!drivers) {
      let response = await axios.get(
        `http://api.jolpi.ca/ergast/f1/${String(req?.body?.year)}/drivers`
      );

      drivers = response?.data?.MRData?.DriverTable?.Drivers;

      if (drivers && drivers?.length > 0) {
        // Create the object
        drivers = await prisma.driver.create({
          data: {
            year: Number(req?.body?.year),
            drivers: drivers,
          },
          select: {
            drivers: true,
          },
        });
      } else {
        throw new Error("Data unavailable");
      }
    }

    // 1 hour since this data is in DB and don't need to call API
    await redisClient.setEx(
      `drivers-${req?.body?.year}`,
      60 * 60,
      JSON.stringify({ drivers: { year: req?.body?.year, drivers } })
    );

    // Return the year and the drivers
    res.status(200).send({ drivers: { year: req?.body?.year, drivers } });
    return;
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Constructors for a specific year
export const getConstructors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let constructors;

    // Find constructors in database
    constructors = await prisma.constructor.findUnique({
      where: {
        year: Number(req?.body?.year),
      },
      // select: {
      //   constructors: true,
      // },
    });

    // If database entry does not exist, fetch from API
    if (!constructors) {
      let response = await axios.get(
        `http://api.jolpi.ca/ergast/f1/${String(req?.body?.year)}/constructors`
      );

      constructors = response?.data?.MRData?.ConstructorTable?.Constructors;

      if (constructors && constructors?.length > 0) {
        // Create the object
        constructors = await prisma.constructor.create({
          data: {
            year: Number(req?.body?.year),
            constructors: constructors,
          },
          // select: {
          //   constructors: [true],
          // },
        });
      } else {
        throw new Error("Data unavailable");
      }
    }

    // 1 hour since this data is in DB and don't need to call API
    await redisClient.setEx(
      `constructors-${req?.body?.year}`,
      60 * 60,
      JSON.stringify({ constructors: { year: req?.body?.year, constructors } })
    );

    // Return the year and the constructors

    res
      .status(200)
      .send({ constructors: { year: req?.body?.year, constructors } });
    return;
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Circuits for a specific year
export const getCircuits = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let circuits;

    // Find circuits in DB
    circuits = await prisma.circuit.findUnique({
      where: {
        year: Number(req?.body?.year),
      },
      select: {
        circuits: true,
      },
    });

    // If not present in DB, fetch from API.
    if (!circuits) {
      let response = await axios.get(
        `http://api.jolpi.ca/ergast/f1/${String(req?.body?.year)}/circuits`
      );

      circuits = response?.data?.MRData?.CircuitTable?.Circuits;

      if (circuits && circuits?.length > 0) {
        // Create the object
        circuits = await prisma.circuit.create({
          data: {
            year: Number(req?.body?.year),
            circuits: circuits,
          },
          select: {
            circuits: true,
          },
        });
      } else {
        throw new Error("Data unavailable");
      }
    }

    // 1 hour since this data is in DB and don't need to call API
    await redisClient.setEx(
      `circuits-${req?.body?.year}`,
      60 * 60,
      JSON.stringify({ circuits: { year: req?.body?.year, circuits } })
    );

    // Return the year and the circuits
    res
      .status(200)
      .send({ circuits: { year: req?.body?.year, circuits: circuits } });
    return;
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Race Schedule for a specific year
export const getSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let schedule;

    // Find the schedule in database
    schedule = await prisma.schedule.findUnique({
      where: {
        year: Number(req?.body?.year),
      },
      select: {
        raceschedule: true,
      },
    });

    // If not present in DB, fetch from API
    if (!schedule) {
      let response = await axios.get(
        `http://api.jolpi.ca/ergast/f1/${String(req?.body?.year)}`
      );

      schedule = response?.data?.MRData?.RaceTable?.Races;

      if (schedule && schedule?.length > 0) {
        // Create the object
        schedule = await prisma.schedule.create({
          data: {
            year: Number(req?.body?.year),
            raceschedule: schedule,
          },
          select: {
            raceschedule: true,
          },
        });
      } else {
        throw new Error("Data unavailable");
      }
    }

    // 1 hour since this data is in DB and don't need to call API
    await redisClient.setEx(
      `schedule-${req?.body?.year}`,
      60 * 60,
      JSON.stringify({ schedule: { year: req?.body?.year, schedule } })
    );

    // Return the schedule and the year
    res
      .status(200)
      .send({ schedule: { year: req?.body?.year, schedule: schedule } });
    return;
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Driver Standings for a specific year
export const getDriverStandings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let standings;

    console.log(req?.body);

    // Not current year (standings can be saved as they wont change)
    if (req?.body?.year != new Date().getFullYear()) {
      // Find the standings in the database
      standings = await prisma.driverstandings.findUnique({
        where: {
          year: Number(req?.body?.year),
        },
        select: {
          standings: true,
        },
      });

      // If standings are not present in db, fetch from api.
      if (!standings) {
        let result = await axios.get(
          `https://api.jolpi.ca/ergast/f1/${req?.body?.year}/driverstandings`
        );

        standings =
          result?.data?.MRData?.StandingsTable?.StandingsLists[0]
            ?.DriverStandings;

        console.log(standings);

        if (standings && standings?.length > 0) {
          // Create the object in db
          standings = await prisma.driverstandings.create({
            data: {
              year: Number(req?.body?.year),
              standings: standings,
            },
            select: {
              standings: true,
            },
          });
        } else {
          console.log("Driver Standings unavailable.");
          throw new Error("Data unavailable");
        }
      }

      // 1 hour since this data is in DB and don't need to call API
      await redisClient.setEx(
        `drivers-standings-${req?.body?.year}`,
        60 * 60,
        JSON.stringify({
          standings: { year: req?.body?.year, standings: standings },
        })
      );

      // Return the year and the standings
      res
        .status(200)
        .send({ standings: { year: req?.body?.year, standings: standings } });
      return;
    }
    // For current year, standings cannot be stored as they can change
    else {
      let result = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${req?.body?.year}/driverstandings`
      );

      standings =
        result?.data?.MRData?.StandingsTable?.StandingsLists[0]
          ?.DriverStandings;

      console.log(standings);

      if (!standings || standings?.length == 0) {
        console.log("Driver Standings unavailable.");
        throw new Error("Data unavailable");
      }

      // 12 hours as this data cannot be persisted in DB and thus cached longer (doesn't change frequently but called a lot)
      await redisClient.setEx(
        `drivers-standings-${req?.body?.year}`,
        60 * 60 * 12,
        JSON.stringify({
          standings: { year: req?.body?.year, standings: { standings } },
        })
      );

      res.status(200).send({
        standings: { year: req?.body?.year, standings: { standings } },
      });
      return;
    }
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Constructor Standings for a specific year
export const getConstructorStandings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let standings;

    // Not current year (standings can be saved as they wont change)
    if (req?.body?.year != new Date().getFullYear()) {
      // Find the standings in the database
      standings = await prisma.constructorstandings.findUnique({
        where: {
          year: Number(req?.body?.year),
        },
        select: {
          standings: true,
        },
      });

      // If standings are not present in db, fetch from api.
      if (!standings) {
        let result = await axios.get(
          `https://api.jolpi.ca/ergast/f1/${req?.body?.year}/constructorstandings`
        );

        standings =
          result?.data?.MRData?.StandingsTable?.StandingsLists[0]
            ?.ConstructorStandings;

        if (standings && standings?.length > 0) {
          // Create the object in db
          standings = await prisma.constructorstandings.create({
            data: {
              year: Number(req?.body?.year),
              standings: standings,
            },
            select: {
              standings: true,
            },
          });
        } else {
          throw new Error("Data unavailable");
        }
      }

      // 1 hour since this data is in DB and don't need to call API
      await redisClient.setEx(
        `constructors-standings-${req?.body?.year}`,
        60 * 60,
        JSON.stringify({
          standings: { year: req?.body?.year, standings: standings },
        })
      );

      // Return the year and the standings
      res
        .status(200)
        .send({ standings: { year: req?.body?.year, standings: standings } });
      return;
    } else {
      let result = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${req?.body?.year}/constructorstandings`
      );

      standings =
        result?.data?.MRData?.StandingsTable?.StandingsLists[0]
          ?.ConstructorStandings;

      if (!standings || standings?.length == 0) {
        console.log("Driver Standings unavailable.");
        throw new Error("Data unavailable");
      }

      // 12 hours as this data cannot be persisted in DB and thus cached longer (doesn't change frequently but called a lot)
      await redisClient.setEx(
        `constructors-standings-${req?.body?.year}`,
        60 * 60 * 12,
        JSON.stringify({
          standings: { year: req?.body?.year, standings: { standings } },
        })
      );

      res.status(200).send({
        standings: { year: req?.body?.year, standings: { standings } },
      });
      return;
    }
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Race Result for a specific year
export const getRaceResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let result;

    // Find the result in the database
    result = await prisma.raceResult.findFirst({
      where: {
        year: Number(req?.body?.year),
        round: Number(req?.body?.round),
      },
    });

    // If not present in DB, fetch from API.
    if (!result) {
      let response = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${req?.body?.year}/${req?.body?.round}/results`
      );

      result = response?.data?.MRData?.RaceTable?.Races[0];

      if (result) {
        // Create the object
        result = await prisma.raceResult.create({
          data: {
            year: Number(req?.body?.year),
            round: Number(req?.body?.round),
            result: result,
          },
          select: {
            result: true,
          },
        });

        // 1 hour since this data is in DB and don't need to call API
        await redisClient.setEx(
          `race-result-${req?.body?.year}-${req?.body?.round}`,
          60 * 60,
          JSON.stringify({
            result: {
              year: req?.body?.year,
              round: req?.body?.round,
              result: result,
            },
          })
        );

        // Return the year and the result
        res.status(200).send({
          result: {
            year: req?.body?.year,
            round: req?.body?.round,
            result: result,
          },
        });
        return;
      } else {
        throw new Error("Data unavailable");
      }
    }

    // 1 hour since this data is in DB and don't need to call API
    await redisClient.setEx(
      `race-result-${req?.body?.year}-${req?.body?.round}`,
      60 * 60,
      JSON.stringify({
        result: {
          year: req?.body?.year,
          round: req?.body?.round,
          result: result,
        },
      })
    );

    // Return the year and the result
    res.status(200).send({
      result: {
        year: req?.body?.year,
        round: req?.body?.round,
        result: result,
      },
    });
    return;
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Race Result for a specific year
export const getQualifyingResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let result;
    // Find the result in the database
    result = await prisma.qualifyingresult.findFirst({
      where: {
        year: Number(req?.body?.year),
        round: Number(req?.body?.round),
      },
    });

    // If not present in DB, fetch from API.
    if (!result) {
      let response = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${req?.body?.year}/${req?.body?.round}/qualifying`
      );

      result = response?.data?.MRData?.RaceTable?.Races[0];

      if (result) {
        // Create the object
        result = await prisma.qualifyingresult.create({
          data: {
            year: Number(req?.body?.year),
            round: Number(req?.body?.round),
            result: result,
          },
          select: {
            result: true,
          },
        });
      } else {
        throw new Error("Data unavailable");
      }
    }

    // 1 hour since this data is in DB and don't need to call API
    await redisClient.setEx(
      `qualifying-result-${req?.body?.year}-${req?.body?.round}`,
      60 * 60,
      JSON.stringify({
        result: {
          year: req?.body?.year,
          round: req?.body?.round,
          result: result,
        },
      })
    );

    // Return the year and the result
    res.status(200).send({
      result: {
        year: req?.body?.year,
        round: req?.body?.round,
        result: result,
      },
    });
    return;
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get Sprint Race Result for a specific year
export const getSprintResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let result;

    // Find the result in the database
    result = await prisma.sprintResult.findFirst({
      where: {
        year: Number(req?.body?.year),
        round: Number(req?.body?.round),
      },
    });

    // If not present in DB, fetch from API.
    if (!result) {
      let response = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${req?.body?.year}/${req?.body?.round}/sprint`
      );

      result = response?.data?.MRData?.RaceTable?.Races[0];

      if (result) {
        // Create the object
        result = await prisma.sprintResult.create({
          data: {
            year: Number(req?.body?.year),
            round: Number(req?.body?.round),
            result: result,
          },
          select: {
            result: true,
          },
        });
      } else {
        throw new Error("Data unavailable");
      }
    }

    // 1 hour since this data is in DB and don't need to call API
    await redisClient.setEx(
      `sprint-result-${req?.body?.year}-${req?.body?.round}`,
      60 * 60,
      JSON.stringify({
        result: {
          year: req?.body?.year,
          round: req?.body?.round,
          result: result,
        },
      })
    );

    // Return the year and the result
    res.status(200).send({
      result: {
        year: req?.body?.year,
        round: req?.body?.round,
        result: result,
      },
    });
    return;
  } catch (err) {
    console.log(err);

    if (err == "Error: Data unavailable") {
      res.status(404).send({ data: "Data unavailable." });
      return;
    }

    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Create a new post.
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req?.file) {
      cloudinary.uploader.upload(req.file.path, async function (err, result) {
        // If error during image upload
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Something went wrong! Please try again.",
          });
          return;
        }
        // If image upload was successful
        else {
          try {
            const uidNum = v4();
            let title = String(req?.body?.title);
            title = title.replaceAll(" ", "-");

            const uid = title + "-" + uidNum;

            // Creating post
            const createdPost = await prisma.post.create({
              data: {
                uid: uid,
                content: req?.body?.content,
                thumbnail: result?.secure_url as string,
                title: req?.body?.title,
                contain: req?.body?.contain == "false" ? false : true,
              },
            });

            // Sending response
            res.status(200).send({ createdPost: createdPost });
            return;
          } catch (err) {
            console.log(err);
            res.status(500).send({ data: "Something went wrong." });
            return;
          }
        }
      });
    }
    // Uploading image to cloudinary
  } catch (err) {
    console.log(err);
    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Update the Post - thumbnail, title, category, otherCategory, content
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // If image is uploaded
    if (req?.file) {
      cloudinary.uploader.upload(req.file.path, async function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Something went wrong! Please try again.",
          });
          return;
        }
        // If image upload was successful
        else {
          // Updating post
          const updatedPost = await prisma.post.update({
            where: {
              id: req?.body?.postId,
            },
            data: {
              content: req?.body?.content,
              thumbnail: result?.secure_url,
              title: req?.body?.title,
            },
          });

          // Sending response
          res.status(200).send({ updatedPost: updatedPost });
          return;
        }
      });
    }
    // If image is not uploaded / google image used.
    else {
      // Updating post
      const updatedPost = await prisma.post.update({
        where: {
          id: req?.body?.postId,
        },
        data: {
          content: req?.body?.content,
          title: req?.body?.title,
        },
      });

      // Sending response
      res.status(200).send({ updatedPost: updatedPost });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get the most recent posts.
export const getAllRecentPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get posts from DB - 10 most recent posts.
    const posts = await prisma.post.findMany({
      select: {
        uid: true,
        title: true,
        thumbnail: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: req?.body?.page * 4,
      take: 4,
    });

    // Check if next page exists.
    const nextPage = await prisma.post.count({
      orderBy: {
        createdAt: "desc",
      },
      skip: (req?.body?.page + 1) * 4,
      take: 4,
    });

    // Return the posts
    res.status(200).send({
      posts: posts,
      nextPage: nextPage != 0 ? req?.body?.page + 1 : null,
    });
    return;
  } catch (err) {
    // Sending error
    console.log(err);
    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Get the post by ID.
export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Receive the postId from the frontend
    const postId = req?.body?.postId;

    // Get the post correlating to the postId passed.
    const post = await prisma.post.findUnique({
      where: {
        uid: postId,
      },
    });

    if (post) {
      // Return the posts
      res.status(200).send({ post: post });
      return;
    } else {
      res.status(404).send({ error: "Could not find post." });
      return;
    }
  } catch (err) {
    // Sending error
    console.log(err);
    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};
