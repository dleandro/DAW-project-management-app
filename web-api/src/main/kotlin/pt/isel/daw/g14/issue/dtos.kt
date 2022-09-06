package pt.isel.daw.g14.issue

import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import pt.isel.daw.g14.common.*
import pt.isel.daw.g14.common.model.ListOfItemsWrapper
import pt.isel.daw.g14.common.model.Labels
import pt.isel.daw.g14.common.model.State
import pt.isel.daw.g14.project.ProjectInputModel
import java.io.Serializable
import java.net.URI
import java.util.*
import javax.persistence.*

/**
 * This file has all the object representations of issues and all issue management exceptions
 */


class IssueNotFound: Exception()

class IssueStateNotAllowed: Exception()

class CommentOnArchivedIssue: Exception()

class LabelNonExistent: Exception()

class TransitionNotAllowed: Exception()

class IssueLabelNonExistent: Exception()

// possible actions you can do to issues (Siren documentation)
val CREATE_ISSUE_ACTION = SirenAction(
        name = "create-issue",
        title = "Create Issue",
        href = URI(ISSUE_PATH),
        method = HttpMethod.PUT,
        type = MediaType.APPLICATION_FORM_URLENCODED,
        fields = listOf(
                SirenAction.Field("id", "int"),
                SirenAction.Field("name", "string"),
                SirenAction.Field("description", "string"),
                SirenAction.Field("dateInfo", "start-date, end-date"),
                SirenAction.Field("labels", "list of strings"),
                SirenAction.Field("state", "string"),
                SirenAction.Field("comments", "string"))
)

fun getIssueDisplayAction(issueId: Int) = SirenAction(
        name = "get-issue",
        title = "Get Specific Issue By Id",
        href = URI(getSpecificIssuePath(issueId)),
        method = HttpMethod.GET,
        type = MediaType.APPLICATION_JSON,
        fields = listOf()
)

fun getIssuesFromProjectAction(projectsName: String) = SirenAction(
        name = "get-issues-from-project",
        title = "Get All Issues Belonging To Specific Project",
        href = URI(getSpecificProjectsIssuesPath(projectsName)),
        method = HttpMethod.GET,
        type = MediaType.APPLICATION_JSON,
        fields = listOf()
)

fun getIssueDeletionAction(issueId: Int) = SirenAction(
        name = "delete-issue",
        title = "Delete Project's issue",
        href = URI(getSpecificIssuePath(issueId)),
        method = HttpMethod.DELETE,
        type = MediaType.APPLICATION_JSON,
        fields = listOf()
)

fun getIssueCommentCreationAction(issueId: Int) = SirenAction(
        name = "add-issue-comment",
        title = "Add Comment To A Specific Issue",
        href = URI(getIssuesCommentPath(issueId)),
        method = HttpMethod.PUT,
        type = MediaType.APPLICATION_FORM_URLENCODED,
        fields = listOf(SirenAction.Field("comment", "string"))
)

fun getIssueLabelCreationAction(issueId: Int) = SirenAction(
        name = "add-issue-label",
        title = "Add Label To A Specific Issue",
        href = URI(getIssuesLabelPath(issueId)),
        method = HttpMethod.PUT,
        type = MediaType.APPLICATION_FORM_URLENCODED,
        fields = listOf(SirenAction.Field("label", "string"))
)

fun getIssuesStateEditionAction(issueId: Int) = SirenAction(
        name = "change-issues-state",
        title = "Change Issues's State",
        href = URI(getIssueStatePath(issueId)),
        method = HttpMethod.PUT,
        type = MediaType.APPLICATION_FORM_URLENCODED,
        fields = listOf(SirenAction.Field("state", "string"))
)

/**
 * This class is a jpa entity present in our database,
 * put requests create an object with these parameters
 */
@Entity
class IssueInputModel(@Id
                      @GeneratedValue
                      var id: Int? = null,
                      @ManyToOne(fetch = FetchType.EAGER)
                      @JoinColumn(name = "fk_project")
                      @OnDelete(action = OnDeleteAction.CASCADE)
                      val project: ProjectInputModel,
                      val name: String,
                      val description: String,
                      val labels: Labels,
                      var state: State,
                      val comments: ListOfItemsWrapper,
                      val creationDate: Date = Date(),
                      var closeDate: Date? = null) {

}

class Issue(
        val projectsName: String,
        val name: String,
        val description: String,
        var labels: Labels,
        var state: State,
        var comments: ListOfItemsWrapper,
        val creationDate: Date = Date(),
        var closeDate: Date? = null): Serializable

/**
 * Represents issues as reported by our API
 *
 * @property    issueInputModel     The issue received
 */
class IssueOutputModel(val issue: IssueInputModel?) {

    fun toSirenObject(selfUri: URI, actions: List<SirenAction>? = null) = SirenEntity(
            properties = this,
            clazz = listOf("Issue"),
            links = listOf(SirenLink(rel = listOf("self"), href = selfUri)),
            actions = actions
    )
}