const ISSUE_CREATION_ACTION_NAME = 'create-issue';
const ISSUE_DELETION_ACTION_NAME = 'delete-issue';
const ADD_COMMENT_ACTION_NAME = 'add-issue-comment';
const ADD_LABEL_ACTION_NAME = 'add-issue-label';
const ADD_STATE_ACTION_NAME = 'change-issues-state';

const findIssueInArray = (array) => array.find(elem => elem === "Issue")

const findActionFromSiren = (sirenContent, actionName) => findIssueInArray(sirenContent.class) ? sirenContent.actions.find((elem) => elem.name === actionName) : undefined;
/**
 * Checks if the given argument is an issue instance.
 * @param {object} sirenContent - the siren object to checked.
 * @returns a boolean valiue indicating whether {sirenContent} is an Issue instance or not.
 */
function isIssue(sirenContent) {
  return Boolean(findIssueInArray(sirenContent.flatMap(elem => elem.class)));
}


/**
 * Gets the issues value from the given siren content.
 * @param {object} sirenContent - the siren content from where the power state is to be extracted.
 */
function issuesFromSiren(sirenContent) {
  return isIssue(sirenContent) ? { value: sirenContent.map(elem => elem.properties.issue) } : undefined
}

function issueDeletionActionFromSiren(sirenContent, issueId) {
  const specificResource = sirenContent.find(res => res.properties.issue.id === issueId)
  const foundAction = specificResource.actions.find((elem) => elem.name === ISSUE_DELETION_ACTION_NAME)
  return isIssue(sirenContent) ? foundAction : undefined
}

function labelCreationActionFromSiren(sirenContent, issueId) {
  const specificResource = sirenContent.find(res => res.properties.issue.id === issueId)
  const foundAction = specificResource.actions.find((elem) => elem.name === ADD_LABEL_ACTION_NAME)
  return isIssue(sirenContent) ? foundAction : undefined
}
function issueCreationActionFromSiren(sirenContent) {
  const specificResource = sirenContent[0]
  const foundAction = specificResource.actions.find((elem) => elem.name === ISSUE_CREATION_ACTION_NAME)
  return isIssue(sirenContent) ? foundAction : undefined
}
function stateCreationActionFromSiren(sirenContent, issueId) {
  const specificResource = sirenContent.find(res => res.properties.issue.id === issueId)
  const foundAction = specificResource.actions.find((elem) => elem.name === ADD_STATE_ACTION_NAME)
  return isIssue(sirenContent) ? foundAction : undefined
}

/**
 * Gets the information required to initialize the HTTP request to be used to create a new 
 * issue resource.
 * @param {string} newValue - The new issue
 * @param {object} action - The action describing the operation (i.e. a Siren Action) 
 */
function initRequestFromAction(newValue, action) {
  return {
    method: action.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newValue)
  }
}

const prepareRequestFromAction = (body, action, baseUrl) => (
  {
    url: new URL(action.href, baseUrl),
    options: { method: action.method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  });

function unknownActionError(action) {
  throw new Error(`Unknown project action: ${action.name}`);
}

/**
 * Function used to obtain the service associated to the api's issue resource
 * @param {URL} resourceUrl - The absolute URL of the api's issue resource
 */
export function getIssueService(resourceUrl) {
  return {

    getIssues: async () => {
      const response = await fetch(resourceUrl)
      return await response.json()
    },
    getUserIssues: async (projects, sirenRes) => {
      if (projects.length !== 0) {
        projects = projects.map(project => project.properties.project.name)
        const arr = sirenRes.filter(issue => projects.includes(issue.properties.issue.project.name))
        return arr
      }
      return []
    },

    getProjectIssues: async (project) => {
      const response = await fetch(resourceUrl)
      const issues = await response.json()
      console.log(project)
      console.log(issues)
      return issues
    },

    deleteIssue: (issueId, sirenRes) => Promise.resolve(issueDeletionActionFromSiren(sirenRes, issueId))
      .then(action => (action.name !== ISSUE_DELETION_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction('', action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    addComment: async (sirenContent, newValue) => {
      const action = findActionFromSiren(sirenContent, ADD_COMMENT_ACTION_NAME)
      const link = new URL(action.href, resourceUrl)
      const option = initRequestFromAction(newValue, action)
      console.log(link)
      console.log(option)
      const response = await fetch(link, option)
      return await response.json()
    },

    convertToIssues: (sirenContent) => issuesFromSiren(sirenContent).value,

    addLabel: (newLabel, sirenRes, issueId) => Promise.resolve(labelCreationActionFromSiren(sirenRes, issueId))
      .then(action => (action.name !== ADD_LABEL_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction(newLabel, action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    addState: (newState, sirenRes, issueId) => Promise.resolve(stateCreationActionFromSiren(sirenRes, issueId))
      .then(action => (action.name !== ADD_STATE_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction(newState, action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    addIssue: (newIssue, sirenRes) => Promise.resolve(issueCreationActionFromSiren(sirenRes))
      .then(action => (action.name !== ISSUE_CREATION_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction(newIssue, action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    /**
     * Gets the action that describes the operation for updating the api's issue resource.
     * @param sirenContent - - the siren content from where the action is to be extracted.
     * @returns {any} the create action or undefined if it could not be found in the received object.
     */
    getIssueCreationAction: (sirenContent) => findActionFromSiren(sirenContent, ISSUE_CREATION_ACTION_NAME),
    getAddCommentActio: (sirenContent) => findActionFromSiren(sirenContent, ADD_COMMENT_ACTION_NAME)

  }
}