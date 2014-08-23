package org.biobank.controllers.study

import org.biobank.controllers._
import org.biobank.service._
import org.biobank.service.{ ServicesComponent, ServicesComponentImpl }
import org.biobank.service.json.Events._
import org.biobank.service.json.Study._
import org.biobank.service.json.StudyAnnotationType._
import org.biobank.service.json.CollectionEventAnnotationType._
import org.biobank.infrastructure.command.StudyCommands._
import org.biobank.domain.study._
import org.biobank.domain.AnnotationValueType._

import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.Future
import play.api.mvc._
import play.api.libs.json._
import play.api.mvc.Results._
import com.typesafe.plugin.use
import play.api.Logger
import play.api.Play.current
import scala.language.reflectiveCalls

import scalaz._
import Scalaz._

object CeventAnnotTypeController extends CommandController with JsonController {

  private def studiesService = use[BbwebPlugin].studiesService

  def get(
    studyId: String,
    annotTypeId: Option[String]) = AuthAction(parse.empty) { token => userId => implicit request =>
    Logger.debug(s"CeventAnnotTypeController.list: studyId: $studyId, annotTypeId: $annotTypeId")

    annotTypeId.fold {
      Ok(studiesService.collectionEventAnnotationTypesForStudy(studyId).toList)
    } {
      id =>
      studiesService.collectionEventAnnotationTypeWithId(studyId, id).fold(
        err => BadRequest(err.list.mkString(", ")),
        annotType => Ok(annotType)
      )
    }  }

  def addAnnotationType = commandAction { cmd: AddCollectionEventAnnotationTypeCmd => implicit userId =>
    val future = studiesService.addCollectionEventAnnotationType(cmd)
    domainValidationReply(future)
  }

  def updateAnnotationType(id: String) = commandAction { cmd: UpdateCollectionEventAnnotationTypeCmd => implicit userId =>
    val future = studiesService.updateCollectionEventAnnotationType(cmd)
    domainValidationReply(future)
  }

  def removeAnnotationType(studyId: String, id: String, ver: Long) = AuthActionAsync(parse.empty) { token => implicit userId => implicit request =>
    val cmd =  RemoveCollectionEventAnnotationTypeCmd(studyId, id, ver)
    val future = studiesService.removeCollectionEventAnnotationType(cmd)
    domainValidationReply(future)
  }

}
