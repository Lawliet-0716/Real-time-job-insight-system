/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} id
 * @property {string} fullName
 * @property {string} email
 * @property {string} education
 * @property {string} experience
 * @property {string} preferredRole
 * @property {string} preferredLocation
 * @property {string[]} skills
 *
 * @typedef {Object} Resume
 * @property {string} _id
 * @property {string} fileName
 * @property {string} targetRole
 * @property {number} atsScore
 * @property {number} resumeScore
 * @property {number} matchPercentage
 * @property {number} weightedMatchPercentage
 * @property {string[]} extractedSkills
 * @property {string[]} matchingSkills
 * @property {string[]} missingSkills
 * @property {{skill: string, demandPercentage: number, priority: string}[]} skillGaps
 * @property {string[]} recommendations
 * @property {{week: string, tasks: string[]}[]} roadmap
 *
 * @typedef {Object} Job
 * @property {string} _id
 * @property {string} title
 * @property {string} company
 * @property {string} companyLogo
 * @property {string} description
 * @property {{city: string, state: string, country: string, fullLocation: string}} location
 * @property {{min?: number, max?: number, currency: string, period: string, text: string}} salary
 * @property {string} employmentType
 * @property {string} experience
 * @property {string[]} skills
 * @property {string[]} technologies
 * @property {string} applyLink
 * @property {string} postedDate
 * @property {boolean} isRemote
 * @property {string} source
 *
 * @typedef {Object} DashboardData
 * @property {{totalJobs: number, remoteJobs: number, totalTrendingSkills: number, resumeScore: number, matchPercentage: number}} stats
 * @property {Resume|null} resume
 * @property {{skill: string, demandCount: number, percentage: number, category: string, lastUpdated: string}[]} trendingSkills
 * @property {Job[]} recentJobs
 */

export {};
