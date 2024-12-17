export const ACCESS_MESSAGES = {
  // Shareable Link Management
  SHARE_LINK_SUCCESS: 'Shareable link created successfully.',
  SHARE_LINK_REVOKED: 'Shareable link has been revoked successfully.',
  SHARE_LINK_CREATION_FAILED: 'Failed to create the shareable link.',
  SHARE_LINK_NOT_FOUND:
    'No shareable link was found with the provided details.',
  SHARE_LINK_EXPIRED: 'The shareable link has expired.',
  SHARE_LINK_REVOKE_FAILED: 'Failed to revoke the shareable link.',

  LINK_VALIDATION_SUCCESS: 'The link is valid and accessible.',
  LINK_VALIDATION_FAILED: 'Failed to validate the link. Please try again.',
  LINK_TOKEN_INVALID: 'The provided link token is invalid or has been revoked.',

  // Access Management
  ACCESS_ADDED_SUCCESS: 'Access has been granted to the specified user.',
  ACCESS_REMOVED_SUCCESS: 'Access for the specified user has been removed.',
  ACCESS_LIST_SUCCESS: 'Access list retrieved successfully.',
  ACCESS_NOT_FOUND: 'The specified access entry was not found.',
  ACCESS_ALREADY_EXISTS: 'Access for this email already exists.',
  ADD_ACCESS_FAILED: 'Failed to add access for the specified user.',
  LIST_ACCESS_FAILED: 'Failed to retrieve the list of access entries.',
  REMOVE_ACCESS_FAILED: 'Failed to remove access for the specified user.',

  // Download URL Generation
  DOWNLOAD_URL_SUCCESS: 'File download URL generated successfully.',
  DOWNLOAD_URL_FAILED: 'Unable to generate the file download URL.',

  // Input Validation
  INVALID_INPUT:
    'Invalid input provided. Please check your request parameters.',
  MISSING_PARAMETERS: 'Required parameters are missing.',

  // Internal Server Errors
  INTERNAL_SERVER_ERROR:
    'An internal server error occurred. Please try again later.',
  OPERATION_FAILED: 'The requested operation could not be completed.',
};
