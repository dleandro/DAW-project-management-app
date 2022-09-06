package pt.isel.daw.g14.common.model

import java.io.Serializable

class ProjectsState (
        val possibleStates: MutableList<State> =
                mutableListOf(State("CLOSED"), State("ARCHIVED")),
        val possibleTransitions: MutableList<Transitions> =
                mutableListOf(
                        Transitions(State("CLOSED"), mutableListOf(State("ARCHIVED")))
                )
)
    : Serializable {

    fun isStateChangeAllowed(state: State, newPossibleState: State): Boolean =
            possibleStates
                    .any { it.presentState == newPossibleState.presentState }
                    &&
                    possibleTransitions.first { it.state.presentState == state.presentState }
                            .stateTransitions
                            .any { it.presentState == newPossibleState.presentState }
}

class Transitions(
        var state: State,
        var stateTransitions: MutableList<State> = mutableListOf()): Serializable