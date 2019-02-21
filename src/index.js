import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'


//demo student data
let students = [
  {
    id: '1',
    name: 'Amy',
    enrollment: "ENROLLED",
    courses: ['1', '2']
  },
  {
    id: '2',
    name: 'Casi',
    enrollment: "ENROLLED",
    courses: ['2']
  },
  {
    id: '3',
    name: 'Alex',
    enrollment: "ENROLLED",
    courses: ['3']
  },
  {
    id: '4',
    name: 'Grad',
    enrollment: "ALUM",
    courses: [ ]
  }
]

let courses = [
  {
    id: '1',
    title: "GraphQL",
    instructor: "DP",
    students: ['1', '3']
  },
  {
    id: '2',
    title: "Apollo",
    instructor: "DP",
    students: ['1', '2']
  }
]
// The typeDef constant is our schema
// Here we define all the Query's we will support
// Here we also define all the Mutations we want to support
// Enumeration types are pre-defined lists
const typeDefs = `
  type Query {
    students: [Student!]!
    courses: [Course!]!
  }

  type Mutation {
    deleteStudent(id: ID!): Student!
  }

  enum Enrollment {
    ENROLLED
    DEFERRED
    WITHDRAWN
    ALUM
  }

  type Student {
    id: ID!
    name: String!
    enrollment: Enrollment!
    courses: [Course!]!
  }

  type Course {
    id: ID!
    title: String!
    instructor: String!
    students: [Student!]!
  }
`

// Resolvers are functions I create that know how to get and return the correct data
const resolvers = {
  Query: {
    students(parent, args, ctx, info) {
      if (!args.query) {
        return students
      }
      return students.filter((student) => {
        return student.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },

    courses(parent, args, ctx, info) {
      if (!args.query) {
        return courses
      }

      return courses.filter((course) => {
        const isTitleMatch = course.title.toLowerCase().includes(args.query.toLowerCase())
        const isInstructorMatch = course.instructor.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isInstructorMatch
      })
    }
  },

  Mutation: {
    deleteStudent(parent, args, ctx, info) {
      const studentIndex = students.findIndex((student) => student.id === args.id)

      if (studentIndex === -1){
        throw new Error("Student not found")
      }

      const deletedStudents = students.splice(studentIndex, 1)

      return deletedStudents[0]
    }
  },

  Student: {
    courses(parent, args, ctx, info) {
      return courses.filter((course)=> {
        return course.id === parent.id
      })
    }
  },

  Course: {
    students(parent, args, ctx, info) {
      return students.filter((student)=> {
        return parent.students.includes(student.id)
      })
    }
  }
}


//start server

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up.')
})
