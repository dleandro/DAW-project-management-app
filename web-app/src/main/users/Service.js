const CREATE_USER_ACTION = "create-user"


function userCreationActionFromSiren(sirenContent) {
  const isUsr = isUser(sirenContent)
  return isUsr ?
    sirenContent.flatMap(elem => elem.actions).find((elem) => elem.name === CREATE_USER_ACTION) :
    undefined
}

const isUser = sirenContent => Boolean(sirenContent.flatMap(elem => elem.class).find(elem => elem === 'User'));

const prepareRequestFromAction = (body, action, baseUrl) => (
  {
    url: new URL(action.href, baseUrl),
    options: { method: action.method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  });

function unknownActionError(action) {
  throw new Error(`Unknown project action: ${action.name}`);
}

/**
 * Function used to obtain the service associated to the HVAC's power-state resource
 * @param {URL} resourceUrl - The absolute URL of the HVAC's power-state resource
 */
export function getUserService(resourceUrl) {
  return {

    getUsers: async () => {

      console.log('userService.getUsers()')

      return fetch(resourceUrl).then(data => data.json()).then(data => { console.log(data); return data })
    },

    registerUser: async (newUser, sirenRes) => {
      console.log(resourceUrl)
      console.log(`userService.registerUser()`)

      return Promise.resolve(userCreationActionFromSiren(sirenRes))
        .then(action => (action.name !== CREATE_USER_ACTION) ? unknownActionError(action) : prepareRequestFromAction(newUser, action, resourceUrl))
        .then(request => {
          return fetch(request.url, request.options)
        })
        .then(data => data.json())

    },

    loginUser: async (userToLogin) => {
      console.log(`userService.loginUser()`)
      const response = await fetch(resourceUrl + '/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userToLogin })
      })
      return await response.json()
    }
  }

}