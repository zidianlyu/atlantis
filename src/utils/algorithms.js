'use strint';
const fs = require('fs');
const BipartiteMax = require('./bipartite-max')
const fileData = fs.readFileSync('./response.json')
const {data} = JSON.parse(fileData)


function getEmails(applications) {
  const emailMap = {}
  for (const application of applications) {
    const email = application['candidateEmail']
    const program = application['programSlug']
    if (email in emailMap) {
      emailMap[email].push(program)
    }
    else {
      emailMap[email] = [program]
    }
  }
  const emails = []
  for (const key in emailMap) {
    emails.push([key, emailMap[key]])
  }
  return emails
}


function getPrograms(applications) {
  const programMap = {}
  for (const application of applications) {
    const program = application['programSlug']
    const capacity = application['programCapacity']
    programMap[program] = capacity
  }
  const programs = []
  for (const key in programMap) {
    programs.push([key, programMap[key]])
  }
  return programs
}

function bestScoreMatch(applications) {
  const programs = getPrograms(applications)
  const programMap = {}
  for (const application of applications) {
    const {programSlug, candidateEmail, qualityScore} = application
    const candidateInfo = {candidateEmail, qualityScore}
    if (programSlug in programMap) {
      programMap[programSlug].push(candidateInfo)
    } else {
      programMap[programSlug] = [candidateInfo]
    }
  }

  for (const key in programMap) {
    programMap[key] = programMap[key].sort((a, b) => b.qualityScore - a.qualityScore)
  }
  let matchCount = 0
  const emailBlockList = new Set()
  const decisions = []
  for (const program of programs) {
    let [programSlug, headcount] = program;
    const matchEmails = []
    while (headcount > 0 && programMap[programSlug].length > 0) {
      const candidateInfo = programMap[programSlug][0]
      const candidateEmail = candidateInfo['candidateEmail']
      programMap[programSlug] = programMap[programSlug].slice(1)
      if (candidateEmail in emailBlockList) {
        continue;
      }

      matchEmails.push(candidateEmail)
      emailBlockList.add(candidateEmail)
      headcount -= 1
      matchCount += 1
      decisions.push({
        matchEmails, programSlug
      })
    }
  }
  return {decisions, matchCount}
}

function buildGraph(rowLen, colLen) {
  const graph = []
  for (let i = 0; i < rowLen; i++) {
    const row = []
    for (let j = 0; j < colLen; j++) {
      row.push(0)
    }
    graph.push(row)
  }
  return graph.slice()
}

function bipartiteMax(applications) {
  const emails = getEmails(applications)
  const programs = getPrograms(applications)
  const graph = buildGraph(emails.length, programs.length)
  const capacities = programs.map(program => program[1])
  for (let i = 0; i < graph.length; i++) {
    const joinedPrograms = emails[i][1]
    console.log(joinedPrograms)
    for (let j = 0; j < graph[0].length; j++) {
      const programSlug = programs[j][0]
      if (programSlug in joinedPrograms) {
        graph[i][j] = 1
      }
    }
  }
  const g = new BipartiteMax(graph, capacities)
  const [matches, matchCount] = g.maximumBipartiteMatch()
  const decisions = []
  for (let i = 0; i < matches.length; i++) {
    let pairInfo = {};
    pairInfo['programSlug'] = programs[i][0];
    const matchEmails = []
    const matchEmailIndexes = matches[i]
    for (const index of matchEmailIndexes) {
      matchEmails.push(emails[index][0])

    }
    pairInfo['matchEmails'] = matchEmails
    decisions.push(pairInfo)
  }
  return {decisions, matchCount}
}

// const {applications} = data

// console.log(bestScoreMatch(applications))
// console.log(bipartiteMax(applications))
