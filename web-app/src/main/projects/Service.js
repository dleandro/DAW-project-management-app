const PROJECT_CREATION_ACTION_NAME = 'create-project';
const PROJECT_DELETION_ACTION_NAME = 'delete-project';
const GET_PROJECT_ACTION_NAME = `get-project`;
const STATE_CREATION_ACTION_NAME = 'add-new-possible-state';
const TRANSITION_CREATION_ACTION_NAME = 'add-new-tansition';
/**
 * Checks if the given argument is a project instance.
 * @param {object} sirenContent - the siren object to checked.
 * @returns a boolean value indicating whether {sirenContent} is a Project instance or not.
 */
const isProject = sirenContent => Boolean(sirenContent.flatMap(elem => elem.class).find(elem => elem === 'Project'));


/**
 * Gets the projects value from the given siren content.
 * @param {object} sirenContent - the siren content from where the power state is to be extracted.
 */
const projectsFromSiren = sirenContent => isProject(sirenContent) ? { value: sirenContent.map(elem => elem.properties.project) } : undefined;


/**
 * Gets the action that describes the operation for updating the api's project resource.
 * @param {object} sirenContent - - the siren content from where the action is to be extracted.
 * @returns the create action or undefined if it could not be found in the received object.
 */
function projectCreationActionFromSiren(sirenContent) {
  const isprj = isProject(sirenContent)
  console.log(isprj)
  console.log(sirenContent.flatMap(elem => elem.actions))
  return isprj ?
    sirenContent.flatMap(elem => elem.actions).find((elem) => elem.name === PROJECT_CREATION_ACTION_NAME) :
    undefined
}

function projectSpecificActionFromSiren(sirenContent, prjname) {
  const specificResource = sirenContent.find(res => res.properties.project.name === prjname)
  const foundAction = specificResource.actions.find((elem) => elem.name === GET_PROJECT_ACTION_NAME)
  return isProject(sirenContent) ? foundAction : undefined
}

function projectDeletionActionFromSiren(sirenContent, prjname) {
  const specificResource = sirenContent.find(res => res.properties.project.name === prjname)
  const foundAction = specificResource.actions.find((elem) => elem.name === PROJECT_DELETION_ACTION_NAME)
  return isProject(sirenContent) ? foundAction : undefined
}

function stateCreationActionFromSiren(sirenContent, prjname) {
  const specificResource = sirenContent.find(res => res.properties.project.name === prjname)
  const foundAction = specificResource.actions.find((elem) => elem.name === STATE_CREATION_ACTION_NAME)
  return isProject(sirenContent) ? foundAction : undefined
}

function getUsersProjectsFromSiren(sirenContent, username) {
  if (sirenContent) {
    return sirenContent.some(res => res.properties.project) ? sirenContent.filter(res => res.properties.project.users.items.includes(username)) : []
  }
  return []
}

function transitionCreationActionFromSiren(sirenContent, prjname) {
  const specificResource = sirenContent.find(res => res.properties.project.name === prjname)
  const foundAction = specificResource.actions.find((elem) => elem.name === TRANSITION_CREATION_ACTION_NAME)
  return isProject(sirenContent) ? foundAction : undefined
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
 * Function used to obtain the service associated to the api's project resource
 * @param {URL} resourceUrl - The absolute URL of the api's project resource
 */
export function getProjectService(resourceUrl) {
  return {
    getProjects: async () => fetch(resourceUrl).then(data => data.json()).then(data => { console.log(data); return data }),

    getUserProjects: async (sirenRes, username) => Promise.resolve(getUsersProjectsFromSiren(sirenRes, username)),

    addState: (newState, sirenRes, prjName) => Promise.resolve(stateCreationActionFromSiren(sirenRes, prjName))
      .then(action => (action.name !== STATE_CREATION_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction(newState, action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    addTransition: (newTransition, sirenRes, prjName) => Promise.resolve(transitionCreationActionFromSiren(sirenRes, prjName))
      .then(action => (action.name !== TRANSITION_CREATION_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction(newTransition, action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    createNewProject: (newValue, sirenRes) => Promise.resolve(projectCreationActionFromSiren(sirenRes))
      .then(action => (action.name !== PROJECT_CREATION_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction(newValue, action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    deleteProject: (sirenRes, prjName) => Promise.resolve(projectDeletionActionFromSiren(sirenRes, prjName))
      .then(action => (action.name !== PROJECT_DELETION_ACTION_NAME) ? unknownActionError(action) : prepareRequestFromAction('', action, resourceUrl))
      .then(request => fetch(request.url, request.options))
      .then(data => data.json()),

    getSpecificProjectBySirenRes: (sirenRes, prjName) => Promise.resolve(projectSpecificActionFromSiren(sirenRes, prjName))
      .then(action => (action.name !== GET_PROJECT_ACTION_NAME) ? unknownActionError(action) : new URL(action.href, resourceUrl))
      .then(request => fetch(request))
      .then(data => data.json()),
    getSpecificProject: async (action, prjName) => {


      if (action.name !== GET_PROJECT_ACTION_NAME) {
        throw new Error(`Unknown project creation action ${action.name}`)
      }
      const response = await fetch(new URL(action.href.replace(':projectsName', prjName), resourceUrl))
      return await response.json()
    },
    convertToProjects: (sirenContent) => projectsFromSiren(sirenContent).value
  }
}