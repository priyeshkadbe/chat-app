import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PHONE_NUMBER_REGEX } from "../constants";

export const validateSendMessage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { senderPhone, receiverPhone, content } = req.body;

  if (!senderPhone || !receiverPhone || !content) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: "Sender phone, receiver phone, and message content are required",
    });
    return;
  }

  // Clean the phone numbers by removing any whitespace
  const cleanSenderPhone = senderPhone.replace(/\s+/g, "");
  const cleanReceiverPhone = receiverPhone.replace(/\s+/g, "");

  if (
    !PHONE_NUMBER_REGEX.test(cleanSenderPhone) ||
    !PHONE_NUMBER_REGEX.test(cleanReceiverPhone)
  ) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error:
        "Invalid phone number format. Phone numbers should be 10-15 digits, optionally starting with +",
    });
    return;
  }

  // Validate message content
  if (typeof content !== "string" || content.trim().length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: "Message content cannot be empty",
    });
    return;
  }

  // Update the request body with cleaned phone numbers
  req.body.senderPhone = cleanSenderPhone;
  req.body.receiverPhone = cleanReceiverPhone;

  next();
};

export const validatePhoneNumber = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const phoneNumber = req.params.phoneNumber;
  const cleanPhoneNumber = phoneNumber?.replace(/\s+/g, "");

  if (!phoneNumber || !PHONE_NUMBER_REGEX.test(cleanPhoneNumber)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error:
        "Invalid phone number format. Phone numbers should be 10-15 digits, optionally starting with +",
    });
    return;
  }

  // Update the params with cleaned phone number
  req.params.phoneNumber = cleanPhoneNumber;

  next();
};

export const validatePhoneNumbers = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const phoneNumbers = req.params.phoneNumbers;
  const [phone1, phone2] = phoneNumbers.split("-");

  if (!phone1 || !phone2) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error:
        "Both phone numbers are required and should be separated by a hyphen",
    });
    return;
  }

  // Clean the phone numbers by removing any whitespace
  const cleanPhone1 = phone1.replace(/\s+/g, "");
  const cleanPhone2 = phone2.replace(/\s+/g, "");

  if (
    !PHONE_NUMBER_REGEX.test(cleanPhone1) ||
    !PHONE_NUMBER_REGEX.test(cleanPhone2)
  ) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error:
        "Invalid phone number format. Phone numbers should be 10-15 digits, optionally starting with +",
    });
    return;
  }

  // Update the params with cleaned phone numbers
  req.params.phoneNumbers = `${cleanPhone1}-${cleanPhone2}`;

  next();
};
