package pt.isel.daw.g14.project

import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import pt.isel.daw.g14.common.*
import pt.isel.daw.g14.common.model.ListOfItemsWrapper
import pt.isel.daw.g14.common.model.ProjectsState
import java.lang.Exception
import java.net.URI
import javax.persistence.*

/**
 * This file has all the representations for project objects and all project management exceptions
 */

class ProjectNotFound: Exception()

class DuplicatePossibleState: Exception()

class DuplicateTransition: Exception()

// possible actions you can do to projects (Siren documentation)
val CREATE_PROJECT_ACTION = SirenAction(
        name = "create-project",
        title = "Create Project",
        href = URI(PROJECT_PATH),
        method = HttpMethod.POST,
        type = MediaType.APPLICATION_FORM_URLENCODED,
        fields = listOf(
                SirenAction.Field("name", "string"),
                SirenAction.Field("users", "array of users"),
                SirenAction.Field("description", "string"),
                SirenAction.Field("issues", "array of issues"),
                SirenAction.Field("state", "json object"))
)


val GET_PROJECTS_ACTION = SirenAction(
        name = "get-all-projects",
        title = "Get All Projects",
        href = URI(PROJECT_PATH),
        method = HttpMethod.GET,
        type = MediaType.APPLICATION_JSON,
        fields = listOf()
)

fun getProjectDeletionAction(projectsName: String) = SirenAction(
        name = "delete-project",
        title = "Delete Project",
        href = URI(getSpecificProjectPath(projectsName)),
        method = HttpMethod.DELETE,
        type = MediaType.APPLICATION_JSON,
        fields = listOf()
)

fun getProjectDisplayAction(projectsName: String) = SirenAction(
        name = "get-project",
        title = "Get Specific Project",
        href = URI(getSpecificProjectPath(projectsName)),
        method = HttpMethod.GET,
        type = MediaType.APPLICATION_JSON,
        fields = listOf()
)

fun getStateAdditionAction(projectsName: String) = SirenAction(
        name = "add-new-possible-state",
        title = "Add new possible state",
        href = URI(getProjectStatePath(projectsName)),
        method = HttpMethod.PUT,
        type = MediaType.APPLICATION_JSON,
        fields = listOf(
                SirenAction.Field("newState", "string")
        )
)

fun getTransitionAdditionAction(projectsName: String) = SirenAction(
        name = "add-new-tansition",
        title = "add new possible transition",
        href = URI(getProjectTransitionsPath(projectsName)),
        method = HttpMethod.PUT,
        type = MediaType.APPLICATION_JSON,
        fields = listOf(
                SirenAction.Field("newTransition", "Transitions")
        )
)

/**
 * This class is a jpa entity present in our database,
 * post requests create an object with these parameters
 */
@Entity
class ProjectInputModel(
        @Id
        val name: String,
        val description: String,
        val users: ListOfItemsWrapper,
        val projectsState: ProjectsState) {
}

/**
 * Represents projects as reported by our API
 *
 * @property    project     The project received
 */
class ProjectOutputModel(val project: ProjectInputModel?) {

    fun toSirenObject(selfUri: URI, actions: List<SirenAction>? = null) = SirenEntity(
            properties = this,
            clazz = listOf("Project"),
            links = listOf(SirenLink(rel = listOf("self"), href = selfUri)),
            actions = actions
    )
}