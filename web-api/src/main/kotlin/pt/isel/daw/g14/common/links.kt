package pt.isel.daw.g14.common

const val HOME_PATH = "/api"
const val PROJECT_PATH = "${HOME_PATH}/projects"
const val ISSUE_PATH = "${HOME_PATH}/issues"
const val USER_PATH = "${HOME_PATH}/user"

const val SPECIFIC_PROJECT_PART = "/{projectsName}"
const val STATE = "/state"
const val TRANSITIONS = "/transitions"

const val SPECIFIC_ISSUE_PART = "/{issueId}"
const val COMMENT = "/comment"
const val LABEL = "/label"

const val LOGIN_USER_PATH = "/login"

fun getSpecificProjectPath(projectsName: String) = "${PROJECT_PATH}/${projectsName}"
fun getProjectStatePath(projectsName: String) = "${getSpecificProjectPath(projectsName)}${STATE}"
fun getProjectTransitionsPath(projectsName: String) = "${getSpecificProjectPath(projectsName)}${TRANSITIONS}"

fun getSpecificIssuePath(issueId: Int): String = "${ISSUE_PATH}/${issueId}"
fun getIssueStatePath(issueId: Int) = "${getSpecificIssuePath(issueId)}${STATE}"
fun getIssuesCommentPath(issueId: Int) = "${getSpecificIssuePath(issueId)}${COMMENT}"
fun getIssuesLabelPath(issueId: Int) = "${getSpecificIssuePath(issueId)}${LABEL}"
fun getSpecificProjectsIssuesPath(projectsName: String) = "${ISSUE_PATH}?projectsName=${projectsName}"