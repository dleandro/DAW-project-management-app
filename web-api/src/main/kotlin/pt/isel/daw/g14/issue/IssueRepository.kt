package pt.isel.daw.g14.issue

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import pt.isel.daw.g14.common.model.ListOfItemsWrapper
import pt.isel.daw.g14.common.model.Labels
import pt.isel.daw.g14.common.model.State

interface IssueRepository : CrudRepository<IssueInputModel, Int>{

    @Modifying
    @Transactional
    @Query("update IssueInputModel set comments = :updatedComments WHERE id = :issueId")
    fun updateIssuesComments(@Param("issueId") issueId: Int, @Param("updatedComments") updatedListOfItemsWrapper: ListOfItemsWrapper)

    @Modifying
    @Transactional
    @Query("update IssueInputModel set state = :updatedState WHERE id = :issueId")
    fun updateIssuesState(@Param("issueId") issueId: Int, @Param("updatedState") updatedState: State)

    @Modifying
    @Transactional
    @Query("update IssueInputModel set labels = :updatedLabels WHERE id = :issueId")
    fun updateIssuesLabels(@Param("issueId") issueId: Int, @Param("updatedLabels") updatedLabels: Labels)

}