class BipartiteMax {
  constructor(graph, programCapacities) {
    this.graph = graph
    this.applicantCount = graph.length
    this.programCount = graph[0].length
    this.programCapacities = programCapacities
  }

  buildProgramMatches() {
    const programMatches = [];
    for (let i = 0; i < this.programCount; i++) {
      programMatches.push([])
    }
    return programMatches
  }

  canAnyApplicantMatch(applicantIndexes, programMatches, programSeen, programIndex) {
    console.log(applicantIndexes)
    for (const applicantIndex of applicantIndexes) {
      if (this.canApplicantMatch(applicantIndex, programMatches, programSeen)) {
        // # If that applicant can fit it, remove him from the current list.
        programMatches[programIndex].splice(applicantIndex, 1)
        return true
      }
    }
    return false
  }

  canApplicantMatch(applicantIndex, programMatches, programSeen) {
    for (let programIndex = 0; programIndex < this.programCount; programIndex++) {
      // # 1. Applicant interested in the program.
      // # 2. Applicant has never seen this program.
      if (this.graph[applicantIndex][programIndex] == 1 && programSeen[programIndex] == false) {
        programSeen[programIndex] = true

        // # 1. Progam has yet reached the maximum capacity.
        // # 2. If other take the match, can they change to other place.
        if ((programMatches[programIndex].length < this.programCapacities[programIndex]) ||
          (this.canAnyApplicantMatch(programMatches[programIndex], programMatches, programSeen, programIndex))
        ) {
          programMatches[programIndex].push(applicantIndex)
          return true
        }
      }
    }
    return false;
  }

  build_array(count) {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push(false)
    }
    return arr;
  }

  maximumBipartiteMatch() {
    const programMatches = this.buildProgramMatches()
    let matchCount = 0;
    for (let applicantIndex = 0; applicantIndex < this.applicantCount; applicantIndex++) {
      const programSeen = this.build_array(this.programCount)
      if (this.canApplicantMatch(applicantIndex, programMatches, programSeen)) {
        matchCount += 1
      }
    }
    return [programMatches, matchCount]
  }
}
module.exports = BipartiteMax

// const graph = [
//   [0, 1, 1, 0],
//   [0, 1, 0, 0],
//   [0, 1, 1, 0],
//   [0, 0, 1, 0],
//   [0, 0, 1, 0],
//   [0, 0, 1, 0],
//   [1, 0, 0, 1],
//   [0, 0, 0, 1],
//   [0, 0, 0, 1]
// ]
// const capacities = [1, 2, 3, 3]

// const g = new BipartiteMax(graph, capacities)
// console.log(g.maximumBipartiteMatch())
