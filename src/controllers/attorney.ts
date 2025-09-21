import { Response } from "express";
import { ATTORNEY_TYPE, ATTORNEY_TYPE_ARRAY } from "../constants";
import Advocate from "../models/Advocate";
import Paralegal from "../models/Paralegal";

const getAllAttorneys = async (req: any, res: Response) => {
    try {
        const { page = 1, limit = 10, filters = {} } = req.body;
        const skip = (page - 1) * limit;

        const {
            accountType,
            specializations,
            search,
            ratings,
            jurisdictions,
            languages,
            minyearsofexperience,
            maxyearsofexperience,
        } = filters;

        if (accountType && !ATTORNEY_TYPE_ARRAY.includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid type",
            });
        }

        if (limit > 20) {
            return res.status(400).json({
                success: false,
                message: "Limit cannot be greater than 50",
            });
        }

        const filterQuery: any = {
            isAvailable: true,
            activationStatus: "approved",
        };

        if (search) {
            filterQuery.$or = [
                { username: { $regex: search, $options: "i" } },
                { bio: { $regex: search, $options: "i" } },
                {
                    $expr: {
                        $regexMatch: {
                            input: {
                                $concat: ["$firstName", " ", "$lastName"],
                            },
                            regex: search,
                            options: "i",
                        },
                    },
                },
            ];
        }

        if (ratings && Array.isArray(ratings) && ratings.length > 0) {
            filterQuery.rating = { $in: ratings };
        }

        // Jurisdiction array filtering
        if (
            jurisdictions &&
            Array.isArray(jurisdictions) &&
            jurisdictions.length > 0
        ) {
            filterQuery["jurisdiction.state"] = {
                $in: jurisdictions.map((j) => new RegExp(j, "i")),
            };
        }

        // Specializations array filtering
        if (
            specializations &&
            Array.isArray(specializations) &&
            specializations.length > 0
        ) {
            filterQuery["specializations.category"] = {
                $in: specializations.map((s) => new RegExp(s, "i")),
            };
        }

        if (languages && Array.isArray(languages) && languages.length > 0) {
            filterQuery.languages = { $in: languages };
        }

        // Years of experience numeric range filtering
        if (
            minyearsofexperience !== undefined ||
            maxyearsofexperience !== undefined
        ) {
            // Use $expr to compare numeric values stored as strings
            const expConditions = [];
            if (minyearsofexperience !== undefined) {
                expConditions.push({
                    $gte: [{ $toDouble: "$yearsOfExp" }, minyearsofexperience],
                });
            }
            if (maxyearsofexperience !== undefined) {
                expConditions.push({
                    $lte: [{ $toDouble: "$yearsOfExp" }, maxyearsofexperience],
                });
            }

            if (expConditions.length > 0) {
                filterQuery.$expr =
                    expConditions.length === 1
                        ? expConditions[0]
                        : { $and: expConditions };
            }
        }

        let attorneys = [];
        let totalResults = 0;

        const projectStage = {
            $project: {
                _id: 1,
                accountType: 1,
                firstName: 1,
                lastName: 1,
                name: {
                    $concat: ["$firstName", " ", "$lastName"],
                },
                bio: 1,
                image: 1,
                dob: 1,
                yoe: "$yearsOfExp",
                rating: 1,
                numberOfReviews: {
                    $size: { $ifNull: ["$reviews", []] },
                },
                location: {
                    city: "$address.city",
                    state: "$address.state",
                    country: "$address.country",
                },
                responseTime: 1,
                availability: "$isAvailable",
                minRate: "$minPrice",
                totalCases: {
                    $size: { $ifNull: ["$appointments", []] },
                },
                specializations: 1,
                hourlyRate: 1,
                languages: 1,
                jurisdiction: {
                    $map: {
                        input: "$jurisdiction",
                        as: "j",
                        in: {
                            state: "$$j.state",
                        },
                    },
                },
                achievementAndComments: 1,
            },
        };

        if (accountType) {
            let AttorneyModel =
                accountType === ATTORNEY_TYPE.ADVOCATE ? Advocate : Paralegal;

            totalResults = await AttorneyModel.countDocuments(filterQuery);

            attorneys = await AttorneyModel.aggregate([
                { $match: filterQuery },
                projectStage,
                { $sort: { rating: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]);
        } else {
            const matchStage = {
                $match: filterQuery,
            };

            const countPipeline = [
                matchStage,
                {
                    $unionWith: {
                        coll: "paralegals",
                        pipeline: [matchStage],
                    },
                },
                { $count: "total" },
            ];

            const countResult = await Advocate.aggregate(countPipeline);
            totalResults = countResult.length > 0 ? countResult[0].total : 0;

            attorneys = await Advocate.aggregate([
                matchStage,
                {
                    $unionWith: {
                        coll: "paralegals",
                        pipeline: [matchStage],
                    },
                },
                projectStage,
                { $sort: { rating: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]);
        }

        const totalPages = Math.ceil(totalResults / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;

        return res.status(200).json({
            success: true,
            message: "Attorneys fetched successfully",
            data: attorneys,
            pagination: {
                currentPage: currentPage,
                hasNextPage: hasNextPage,
                totalResults: totalResults,
                totalPages: totalPages,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { getAllAttorneys };
