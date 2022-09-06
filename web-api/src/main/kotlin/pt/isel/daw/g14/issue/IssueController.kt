package pt.isel.daw.g14.issue

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.daw.g14.common.*
import pt.isel.daw.g14.common.model.ListOfItemsWrapper
import pt.isel.daw.g14.common.model.Labels
import pt.isel.daw.g14.common.model.State

// Access our Postman Collection to make the requests easily https://www.getpostman.com/collections/424e0af7546db7767fdc

@RestController
@RequestMapping(ISSUE_PATH, produces = [SIREN_MEDIA_TYPE], headers = [ "Accept=application/json"])
class IssueController {

    @Autowired
    private lateinit var issueService: IssueService

    @ExceptionHandler
    fun handleIssueNotFound(e: IssueNotFound) =
            ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/issue-not-found",
                            title = "Issue not found",
                            detail = "The specified issue is not present in our database",
                            status = 404
                    ))

    @ExceptionHandler
    fun handleIssueStateNotAllowed(e: IssueStateNotAllowed) =
            ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/issue-state-not-allowed",
                            title = "Issue state not allowed",
                            detail = "The required issue state or its transition is not allowed in the context of this" +
                                    " project",
                            status = 403
                    ))

    @ExceptionHandler
    fun handleCommentNotAllowed(e: CommentOnArchivedIssue) =
            ResponseEntity
                    .status(HttpStatus.METHOD_NOT_ALLOWED)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/comment-not-possible",
                            title = "Comment not possible",
                            detail = "You can't add a comment to an already archived issue",
                            status = 405
                    ))

    @ExceptionHandler
    fun handleLabelNonExistent(e: LabelNonExistent) =
            ResponseEntity
                    .status(HttpStatus.METHOD_NOT_ALLOWED)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/label-not-available",
                            title = "Comment not possible",
                            detail = "You can't add a comment to an already archived issue",
                            status = 405
                    ))


    @ExceptionHandler
    fun handleTransitionNotAllowed(e: TransitionNotAllowed) =
            ResponseEntity
                    .status(HttpStatus.METHOD_NOT_ALLOWED)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/transition-not-allowed",
                            title = "Transition not allowed",
                            detail = "You can't change this issue's state because this transition" +
                                    " is not allowed in this project",
                            status = 405
                    ))

    @ExceptionHandler
    fun handleIssueLabelNonExistent(e: IssueLabelNonExistent) =
            ResponseEntity
                    .status(HttpStatus.METHOD_NOT_ALLOWED)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/label-not-available",
                            title = "Issue Label non existent",
                            detail = "You can'tclabel this issue with a non existent label",
                            status = 405
                    ))
    // Create new issue on a specific project
    @PutMapping
    fun pushIssue(@RequestBody issue: Issue) =
        issueService.createIssue(issue)


    // Delete issue from specific project
    @DeleteMapping(SPECIFIC_ISSUE_PART)
    fun deleteIssue(@PathVariable("issueId") issueId: Int) =
        issueService.deleteIssue(issueId)



    // Get specific issue, insert issue's id on the path
    @GetMapping(SPECIFIC_ISSUE_PART)
    fun getIssue(@PathVariable("issueId") issueId: Int) =
            issueService.getIssue(issueId)

    @GetMapping
    fun getSpecificProjectsIssues(@RequestParam projectsName: String?): Any {
        return if (projectsName == null) {
            issueService.getAllIssues()
        } else {
            issueService.getSpecificProjectsIssues(projectsName)
        }

    }
    // Add a list of comments to the current issue
    @PutMapping("${SPECIFIC_ISSUE_PART}${COMMENT}")
    fun addIssueComment(@PathVariable("issueId") issueId: Int,
                  @RequestBody newListOfItemsWrapper: ListOfItemsWrapper) = issueService.addComment(issueId, newListOfItemsWrapper)

    // Add a list of labels to the current issue
    @PutMapping("${SPECIFIC_ISSUE_PART}${LABEL}")
    fun addIssueLabel(@PathVariable("issueId") issueId: Int,
                      @RequestBody newLabels: Labels) = issueService.addLabel(issueId, newLabels)

    // Edits issue's current state
    @PutMapping("${SPECIFIC_ISSUE_PART}${STATE}")
    fun editIssuesState(@PathVariable("issueId") issueId: Int,
                        @RequestBody newPossibleState: State) = issueService.editState(issueId, newPossibleState)

}