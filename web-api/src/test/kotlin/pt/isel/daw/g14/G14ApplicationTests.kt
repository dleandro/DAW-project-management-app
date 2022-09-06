package pt.isel.daw.g14

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import pt.isel.daw.g14.common.model.ListOfItemsWrapper
import pt.isel.daw.g14.project.ProjectService
import pt.isel.daw.g14.issue.IssueInputModel
import pt.isel.daw.g14.issue.IssueService
import pt.isel.daw.g14.common.model.ProjectsState
import pt.isel.daw.g14.common.model.Transitions
import pt.isel.daw.g14.project.ProjectInputModel
import java.util.*


@SpringBootTest
class G14ApplicationTests {
	@Autowired
	lateinit var projectService: ProjectService
	@Autowired
	lateinit var issueService: IssueService

	final val initialIssue1 = IssueInputModel(1, "ProjetoTeste", "ProblemaTeste",
			"probteste", Date(), Date(),
			mutableListOf(Label.DEFECT, Label.EXPLORATION),
			"CLOSED", mutableListOf(ListOfItemsWrapper("c1"), ListOfItemsWrapper("c2")))
	final val initialIssue2 = IssueInputModel(2, "ProjetoTeste", "ProblemaTeste",
			"probteste", Date(), Date(),
			mutableListOf(Label.DEFECT, Label.EXPLORATION),
			"CLOSED", mutableListOf(ListOfItemsWrapper("c32"), ListOfItemsWrapper("c2")))
	final val issueToBeAdded = IssueInputModel(3, "ProjetoTeste", "ProblemaTeste",
			"probteste", Date(), Date(),
			mutableListOf(Label.DEFECT, Label.EXPLORATION),
			"CLOSED", mutableListOf(ListOfItemsWrapper("c2322"), ListOfItemsWrapper("c256")))

	final val projeto= ProjectInputModel("ProjetoTeste", "descricaoteste", mutableListOf(),
			ProjectsState(mutableListOf("Archived","Active","CLOSED"),
					mutableListOf(
							Transitions("Active",mutableListOf("CLOSED","Archived")),
							Transitions("Archived",mutableListOf("CLOSED")
							))))

	final val projetoSemIssues= ProjectInputModel("ProjetoTesteSemIssues", "descricaoteste", mutableListOf(),
			ProjectsState(mutableListOf("Archived","Active","CLOSED"),
					mutableListOf(
							Transitions("CLOSED",mutableListOf("Archived")),
							Transitions("Archived",mutableListOf("CLOSED")
							))))

	fun deleteProjectAndVerify(projectsName:String){
		this.projectService.deleteProject(projectsName)
		assert(!this.projectService.getAllProjects().properties!!.projects.map { it.name }.contains(projectsName))
	}
	fun createProjectAndVerify(project: ProjectInputModel){
		this.projectService.createProject(project)
		assert(this.projectService.getAllProjects().properties!!.projects.map { it.name }.contains(project.name))
		assert( this.projectService.getProject(project.name).properties!!.project != null)
	}
	fun createIssueAndVerify(issue:IssueInputModel){
		this.issueService.createIssue(issue)
		//verifica que foi adicionado o issue
		assert(this.issueService.getIssues(issue.project).properties!!.issues.map{it.name}.contains(issue.name))
		assert(this.issueService.getIssue(issue.project,issue.id).properties!!.issue !=null)
	}
	fun deleteIssueAndVerify( id:Int){
		issueService.deleteIssue(id)
		// verifica issue foi apagado
		assert(issueService.getIssues("ProjetoTeste").properties!!.issues.map{it.id}.contains(id))
	}

	fun verifyProjectWasInitializedWithBothIssues(){
		createProjectAndVerify(projeto)
		assert(this.projectService.getAllProjects().properties!!.projects.filter { it.name==projeto.name }.first().issueInputModels.map { it.name }.contains(initialIssue2.name)) // verifica existencia do issue 2
		assert(this.projectService.getAllProjects().properties!!.projects.filter { it.name==projeto.name }.first().issueInputModels.map { it.name }.contains(initialIssue1.name)) // verifica existencia do issue 1
	}

	@Test
	fun shouldHaveMultipleProjectsCreatedTest() {
		this.projectService.createProject(projetoSemIssues)
		assert(this.projectService.getAllProjects().properties!!.projects.map { it.name }.contains(projetoSemIssues.name))
		assert( this.projectService.getProject("ProjetoTesteSemIssues").properties!!.project != null)
		val projects= this.projectService.getAllProjects()
		assert( projects.properties!!.projects.size == 1)
		//this.projectService.deleteProject(projetoSemIssues.name)
	}

	@Test
	fun createAndDeleteProjectTest() {
		//needs to insert issues in issues table first
		createProjectAndVerify(projetoSemIssues)
		deleteProjectAndVerify(projetoSemIssues.name)
	}

	@Test
	fun createAndDeleteProjectAndIssue(){
		createProjectAndVerify(projeto)
		createIssueAndVerify(initialIssue1)
		createIssueAndVerify(initialIssue2)
		deleteIssueAndVerify(1)
		deleteIssueAndVerify(2)
		deleteProjectAndVerify(projeto.name)
	}



	/*@Test
	fun runsAllIssueOperationsFromProjectServicesTest() {
		createProjectAndVerify()
		verifyProjectWasInitializedWithBothIssues()
		editIssueAndVerify(69)
		deleteIssueAndVerify(69)
		addIssueAndVerify()
		deleteProjectAndVerify()
	}*/

}
