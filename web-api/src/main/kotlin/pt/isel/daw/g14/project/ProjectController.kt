package pt.isel.daw.g14.project

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.daw.g14.common.*
import pt.isel.daw.g14.common.model.State
import pt.isel.daw.g14.common.model.Transitions

// TODO: Missing Error handling and response probably incomplete

// Access our Postman Collection to make the requests easily https://www.getpostman.com/collections/424e0af7546db7767fdc

@RestController
@RequestMapping(PROJECT_PATH, produces = [SIREN_MEDIA_TYPE], headers = [ "Accept=application/json"])
class ProjectController {

    @Autowired
    private lateinit var projectService: ProjectService

    @ExceptionHandler
    fun handleDuplicateState(e: DuplicatePossibleState) =
            ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/duplicate-state",
                            title = "Duplicate State On The Project",
                            detail = "An entry with this exact same possible state is already present on this project",
                            status = 409
                    ))

    @ExceptionHandler
    fun handleDuplicateTransition(e: DuplicateTransition) =
            ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/duplicate-transition",
                            title = "Duplicate Transition On The Project",
                            detail = "An entry with this exact same transition is already present on this project",
                            status = 409
                    ))

    @ExceptionHandler
    fun handleProjectNotFound(e: ProjectNotFound) =
            ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/project-not-found",
                            title = "Project not found",
                            detail = "The specified project is not present on our database",
                            status = 404
                    ))

    // Get all existing projects from our database
    @GetMapping
    fun getProjects() = projectService.getAllProjects()

    // Get specific project
    @GetMapping(SPECIFIC_PROJECT_PART)
    fun getProject(@PathVariable projectsName: String) = projectService.getProject(projectsName)

    // Create project and push it to our database
    @PostMapping
    fun createProject (@RequestBody projectsInputModel: ProjectInputModel) = projectService.createProject(projectsInputModel)

    // Delete specific project
    @DeleteMapping(SPECIFIC_PROJECT_PART)
    fun deleteProject(@PathVariable projectsName: String) = projectService.deleteProject(projectsName)


    @PutMapping("${SPECIFIC_PROJECT_PART}${STATE}")
    fun addNewPossibleState(@PathVariable("projectsName") projectsName: String, @RequestBody newPossibleState: State) =
            projectService.addNewPossibleState(projectsName, newPossibleState)

    @PutMapping("${SPECIFIC_PROJECT_PART}${TRANSITIONS}")
    fun addNewTransition(@PathVariable("projectsName") projectsName: String, @RequestBody newTransition: Transitions) =
            projectService.addNewTransition(projectsName, newTransition)

}