package org.biobank.service

import com.github.t3hnar.bcrypt._
import org.slf4j.LoggerFactory

trait PasswordHasher {
  def encrypt(password: String, salt: String): String

  def generateSalt: String

  def valid(encryptedPwd: String,  salt: String, enteredPwd: String): Boolean
}


class PasswordHasherImpl extends PasswordHasher {

  val log = LoggerFactory.getLogger(this.getClass)

  def encrypt(password: String, salt: String): String = {
    password.bcrypt(salt)
  }

  def generateSalt: String = {
    com.github.t3hnar.bcrypt.generateSalt
  }

  def valid(encryptedPwd: String, salt: String, enteredPwd: String): Boolean = {
    val encryptedEnteredPwd = enteredPwd.bcrypt(salt)
    encryptedPwd == encryptedEnteredPwd
  }
}

