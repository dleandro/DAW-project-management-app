# DAW-1920v-LI61D-G14

## Endpoints 

### GET's 
 * /projects : shows all existing [Projects](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel)
 * /projects/{projectsName} : shows detailed information of a specific [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel), receives a path variable that references which [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) should be displayed
 * /projects/{projectsName}/issues : shows all [Issues](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) from a specified project, receives a path variable that references which [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) should displayed the [Issues](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) from
 * /projects/{projectsName}/issues/{issueId} : shows detailed information of a specific [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) from a [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel), receives a path variable that represents the project and issue in question
 * /user : shows detailed information of a specific [User](https://github.com/A44857/DAW-1920v-LI61D-G14#userinputmodel), body should contain [User](https://github.com/A44857/DAW-1920v-LI61D-G14#userinputmodel), receives a query that represents the user's username

  
  
### POST's
 * /projects : create a new [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel), body should contain all information of the [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) name,description,issueInputModels,state 
 * /user : registrates a new [User](https://github.com/A44857/DAW-1920v-LI61D-G14#userinputmodel), body should contain [User](https://github.com/A44857/DAW-1920v-LI61D-G14#userinputmodel) information.
  
### PUT's
  * /projects/{projectsName}/issues : adds an [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) to a specified [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel), receives a path variable that references which [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) should add the [Issues](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) to and a request body with the [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) information
  * /projects/{projectsName}/issues/{issueId}/comment : adds a list of [Comments](https://github.com/A44857/DAW-1920v-LI61D-G14#comment) to a specific [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel), receives a path variable that represents the [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) and [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) in question and a body with the list of [Comments](https://github.com/A44857/DAW-1920v-LI61D-G14#comment).
  * /projects/{projectsName}/issues/{issueId}/label : adds a list of [Labels](https://github.com/A44857/DAW-1920v-LI61D-G14#label) to a specific [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel), receives a path variable that represents the [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) and [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) in question and a body with the list of [Labels](https://github.com/A44857/DAW-1920v-LI61D-G14#label)
  * /projects/{projectsName}/issues/{issueId}/state : adds a [State](https://github.com/A44857/DAW-1920v-LI61D-G14#state) to a specific [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel), receives a path variable that represents the [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) and [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) in question and a body with the [State](https://github.com/A44857/DAW-1920v-LI61D-G14#state)
 
 
### DELETE's
 * /projects/{projectsName} : erases a specific [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) from the database, receives a path variable that references which [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) should be deleted
 * /projects/{projectsName}/issues/{issueId} : removes a specific [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) from a [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel), receives a path variable that represents the [Project](https://github.com/A44857/DAW-1920v-LI61D-G14#projectinputmodel) and [Issue](https://github.com/A44857/DAW-1920v-LI61D-G14#issueinputmodel) in question
 
 
 # Data Structure
 
## UserInputModel 
Represents a user registrated in our database
```json
{
    username: "exampleName",
    password: "examplePass"
}
```

## ProjectInputModel
```json
  body:{
    name:"newProject",
    description:"just a demonstration project",
    issueInputModels:[
      {
        name:"IssueName",
        description:"simple issue",
        creationDate:"15/7/1987",
        closeDate:"27/12/2021",
        labels:[{}],
        state:"active",
        comments:[{}]
     }]
}
  ```

## IssueInputModel

```json
{
        id: 1,
        projectsName: "newProject",
        name:"IssueName",
        description:"simple issue",
        creationDate:"15/7/1987",
        closeDate:"27/12/2021",
        labels:[{}],
        state:"active",
        comments:[{}]
}
```

## Comment
```json
{description:"example description"}
```

## Label
```java
enum class Label {
    DEFECT, NEW_FUNCTIONALITY, EXPLORATION
}
```

## State
```json
{
    possibleStates: ["OPEN", "CLOSED"],
    possibleTransitions: [Transitions, Transitions]
}
```

## Transitions
```json
{
  state:"CLOSED",
  stateTransitions: [
    ["ARCHIVED","CLOSED"],
    ["ARCHIVED","ACTIVE"],
    ["ACTIVE","COOLDOWN"]
    ]
}
```



