package pt.isel.daw.g14.project

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import pt.isel.daw.g14.common.*
import pt.isel.daw.g14.common.model.ListOfItemsWrapper
import pt.isel.daw.g14.common.model.ProjectsState
import pt.isel.daw.g14.common.model.State
import pt.isel.daw.g14.common.model.Transitions
import pt.isel.daw.g14.issue.IssueRepository
import java.net.URI
import java.util.function.Consumer

@Service
class ProjectService(
        @Autowired private val repository: ProjectRepository,
        @Autowired private val issueRepository: IssueRepository) {

    fun getAllProjects(): List<SirenEntity<ProjectOutputModel>> {
        val projects = repository.findAll()


        if (projects.any()) {

            return    projects.map {
                ProjectOutputModel(it)
                        .toSirenObject(URI(PROJECT_PATH), listOf(
                                getProjectDisplayAction(it.name),
                                getProjectDeletionAction(it.name),
                                CREATE_PROJECT_ACTION,
                                getStateAdditionAction(it.name),
                                getTransitionAdditionAction(it.name)
                        ))}
        }
        return  listOf(ProjectOutputModel(ProjectInputModel("", "", ListOfItemsWrapper(mutableListOf()), ProjectsState()))
                .toSirenObject(URI(PROJECT_PATH), listOf(
                        CREATE_PROJECT_ACTION
                )))

    }

    fun deleteAllProjectIssues(projectsName: String) = issueRepository
            .findAll()
            .filter { issueInputModel -> issueInputModel.project.name ===projectsName }
            .map { issueInputModel -> issueRepository.deleteById(issueInputModel.id!!) };

    fun createProject(project: ProjectInputModel): SirenEntity<ProjectOutputModel> {

        val projectsDefaultState = ProjectsState()

        // checking and adding default states and default transitions to our project
        projectsDefaultState.possibleStates.forEach { defaultState ->

            if (!project.projectsState.possibleStates.contains(defaultState))  {
                project.projectsState.possibleStates.add(defaultState)
            }

        }

        projectsDefaultState.possibleTransitions.forEach { defaultTransition ->

            if (!project.projectsState.possibleTransitions.contains(defaultTransition))  {
                project.projectsState.possibleTransitions.add(defaultTransition)
            }

        }

        repository.save(project)

        return ProjectOutputModel(project)
                .toSirenObject(URI(PROJECT_PATH), listOf(
                        GET_PROJECTS_ACTION,
                        getProjectDisplayAction(project.name),
                        getProjectDeletionAction(project.name),
                        getStateAdditionAction(project.name),
                        getTransitionAdditionAction(project.name)
                ))

    }

    fun deleteProject(projectsName: String): SirenEntity<ProjectOutputModel> {

        try {
            val project = manageSpecificProjectAndThrowIfNotFound(
                    projectsName,
                    Consumer{ deleteAllProjectIssues(projectsName);repository.delete(it) },
                    repository
            )

            return ProjectOutputModel(project)
                    .toSirenObject(URI(getSpecificProjectPath(projectsName)), listOf(
                            CREATE_PROJECT_ACTION,
                            GET_PROJECTS_ACTION,
                            getProjectDisplayAction(projectsName),
                            getStateAdditionAction(projectsName),
                            getTransitionAdditionAction(projectsName)
                    ))

        } catch (e: Exception) {
            throw e
        }
    }

    fun getProject(projectsName: String): SirenEntity<ProjectOutputModel> {

        try {

            val project = manageSpecificProjectAndThrowIfNotFound(
                    projectsName,
                    Consumer { },
                    repository
            )

            return ProjectOutputModel(project)
                    .toSirenObject(URI(getSpecificProjectPath(projectsName)), listOf(
                            CREATE_PROJECT_ACTION,
                            GET_PROJECTS_ACTION,
                            getProjectDeletionAction(projectsName),
                            getStateAdditionAction(projectsName),
                            getTransitionAdditionAction(projectsName)
                    ))

        } catch (e: Exception) {
            throw e
        }

    }

    fun addNewPossibleState(projectsName: String, newPossibleState: State): SirenEntity<ProjectOutputModel> {
        try {

            manageSpecificProjectAndThrowIfNotFound(
                    projectsName,
                    Consumer {
                        if (it.projectsState.possibleStates.contains(newPossibleState)) {
                            throw DuplicatePossibleState()
                        } else {
                            val newState = it.projectsState
                            newState.possibleStates.add(newPossibleState)
                            repository.updateProjectsState(projectsName, newState)
                        }
                    },
                    repository
            )

            return ProjectOutputModel(repository.findById(projectsName).get())
                    .toSirenObject(URI(getProjectStatePath(projectsName)), listOf(
                            CREATE_PROJECT_ACTION,
                            GET_PROJECTS_ACTION,
                            getProjectDisplayAction(projectsName),
                            getProjectDeletionAction(projectsName),
                            getTransitionAdditionAction(projectsName)
                    ))

        } catch (e: Exception) {
            throw e
        }
    }

    fun addNewTransition(projectsName: String, newTransition: Transitions): SirenEntity<ProjectOutputModel> {

        try {

            manageSpecificProjectAndThrowIfNotFound(
                    projectsName,
                    Consumer {
                        if (it.projectsState.possibleTransitions.contains(newTransition)) {
                            throw DuplicateTransition()
                        } else {
                            val newState = it.projectsState
                            newState.possibleTransitions.add(newTransition)
                            repository.updateProjectsState(projectsName, newState)
                        }
                    },
                    repository
            )

            return ProjectOutputModel(repository.findById(projectsName).get())
                    .toSirenObject(URI(getProjectTransitionsPath(projectsName)), listOf(
                            CREATE_PROJECT_ACTION,
                            GET_PROJECTS_ACTION,
                            getProjectDisplayAction(projectsName),
                            getProjectDeletionAction(projectsName),
                            getStateAdditionAction(projectsName)
                    ))

        } catch (e: Exception) {
            throw e
        }
    }



}

fun manageSpecificProjectAndThrowIfNotFound(
        projectsName: String,
        ifFound: Consumer<ProjectInputModel>,
        repository: CrudRepository<ProjectInputModel, String>
): ProjectInputModel {

    var presentProject: ProjectInputModel? = null

    repository
            .findById(projectsName)
            .ifPresentOrElse(
                    { project ->
                        run {
                            presentProject = project
                            ifFound.accept(project)
                        }
                    },
                    { throw ProjectNotFound() }
            )

    return presentProject ?: throw ProjectNotFound()
}
