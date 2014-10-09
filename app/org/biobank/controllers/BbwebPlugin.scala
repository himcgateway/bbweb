package org.biobank.controllers

import org.biobank.domain.user.{ RegisteredUser, User, UserId }
import org.biobank.service.{ TopComponent, ServicesComponentImpl }

import java.io.File
import play.api.libs.Files
import play.api.{ Configuration, GlobalSettings, Logger, Mode, Plugin }
import play.api.libs.concurrent._
import akka.actor.ActorSystem
import akka.actor.Props
import com.typesafe.config.ConfigFactory
import play.api.Play.current
import org.joda.time.DateTime

class BbwebPlugin(val app: play.api.Application)
    extends Plugin
    with TopComponent
    with ServicesComponentImpl {

  override lazy val studiesProcessor = Akka.system.actorOf(Props(new StudiesProcessor), "studyproc")
  override lazy val centresProcessor = Akka.system.actorOf(Props(new CentresProcessor), "centresproc")
  override lazy val usersProcessor = Akka.system.actorOf(Props(new UsersProcessor), "userproc")

  override lazy val studiesService = new StudiesServiceImpl(studiesProcessor)
  override lazy val centresService = new CentresServiceImpl(centresProcessor)
  override lazy val usersService = new UsersService(usersProcessor)

  private val configKey = "slick"
  private val ScriptDirectory = "conf/evolutions/"
  private val CreateScript = "create-database.sql"
  private val DropScript = "drop-database.sql"
  private val ScriptHeader = "-- SQL DDL script\n-- Generated file - do not edit\n\n"

  val defaultUserEmail = "admin@admin.com"

  /**
    *
    */
  override def onStart() {
    // evaluate the lazy variabled declared up top
    studiesProcessor
    centresProcessor
    usersProcessor
    studiesService
    centresService
    usersService

    checkEmailConfig

    createDefaultUser
    //createTestUser

    createSqlDdlScripts

    Logger.info(s"Bbweb Plugin started")
    super.onStart
  }

  override def onStop() {
    Logger.info(s"Bbweb Plugin stopped")
  }

  def checkEmailConfig = {
    app.configuration.getString("smtp.host").getOrElse(
      throw new RuntimeException("smtp server information needs to be set in email.conf"))
  }

  /** Used for debugging only.
    *
    * password is "testuser"
    */
  def createTestUser = {
    val email = "test@biosample.ca"
    val validation = RegisteredUser.create(
      UserId(email),
      -1L,
      DateTime.now,
      "testuser",
      email,
      "$2a$10$bkENUsLcxClf9gce/Mnv3OQcLcG6S5jP730MxGWSKNSKUmaJ/gdGq",
      "$2a$10$bkENUsLcxClf9gce/Mnv3O",
      None)

    if (validation.isFailure) {
      validation.swap.map { err =>
        throw new RuntimeException("could not add default user in development mode: " + err)
      }
    }
    validation map { user =>
      userRepository.put(user)
    }
  }

  /**
    * for debug only - password is "testuser"
    */
  def createDefaultUser: User = {
    //if ((app.mode == Mode.Dev) || (app.mode == Mode.Test)) {

    //
    val validation = RegisteredUser.create(
      UserId(defaultUserEmail),
      -1L,
      DateTime.now,
      "admin",
      defaultUserEmail,
      "$2a$10$Kvl/h8KVhreNDiiOd0XiB.0nut7rysaLcKpbalteFuDN8uIwaojCa",
      "$2a$10$Kvl/h8KVhreNDiiOd0XiB.",
      None)

    validation.fold(
      err => throw new RuntimeException("could not add default user in development mode: " + err),
      user => {
        user.activate.fold(
          err => throw new RuntimeException("could not activate default user in development mode: " + err),
          activeUser => {
            Logger.info("default user created")
            userRepository.put(activeUser)
          }
        )
      }
    )
  }

  /**
    * Creates SQL DDL scripts on application start-up.
    */
  private def createSqlDdlScripts(): Unit = {
    // if (app.mode != Mode.Prod) {
    //   app.configuration.getConfig(configKey).foreach { configuration =>
    //     configuration.keys.foreach { database =>
    //       val databaseConfiguration = configuration.getString(database).getOrElse {
    //         throw configuration.reportError(database, "No config: key " + database, None)
    //       }
    //       val packageNames = databaseConfiguration.spl"," in new WithApplication(fakeApplication()).toSet
    //       val classloader = app.classloader
    //       val ddls = TableScanner.reflectAllDDLMethods(packageNames, classloader)

    //       val scriptDirectory = app.getFile(ScriptDirectory + database)
    //       Files.createDirectory(scriptDirectory)

    //       writeScript(ddls.map(_.createStatements), scriptDirectory, CreateScript)
    //       writeScript(ddls.map(_.dropStatements), scriptDirectory, DropScript)
    //     }
    //   }
    // }
  }

  /**
    * Writes the given DDL statements to a file.
    */
  private def writeScript(
    ddlStatements: Seq[Iterator[String]],
    directory: File,
    fileName: String): Unit = {
    // val createScript = new File(directory, fileName)
    // val createSql = ddlStatements.flatten.mkString("\n\n")
    // Files.writeFileIfChanged(createScript, ScriptHeader + createSql)
  }

}
