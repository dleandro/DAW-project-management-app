package pt.isel.daw.g14.project

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import pt.isel.daw.g14.common.model.ProjectsState
import pt.isel.daw.g14.issue.IssueInputModel

interface ProjectRepository : CrudRepository<ProjectInputModel, String>{

    @Modifying
    @Query("update ProjectInputModel set issues = :updatedIssues WHERE name = :projectsName")
    fun updateProjectsIssues(
            @Param("projectsName") projectsName: String,
            @Param("updatedIssues") updatedIssues: List<IssueInputModel>)

    @Modifying
    @Transactional
    @Query("update ProjectInputModel set projectsState = :newState WHERE name = :projectName")
    fun updateProjectsState(@Param("projectName") name: String?, @Param("newState") projectsState: ProjectsState?)

}