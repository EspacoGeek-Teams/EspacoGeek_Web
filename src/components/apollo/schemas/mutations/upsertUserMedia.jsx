import { gql } from '@apollo/client';

export const UPSERT_USER_MEDIA = gql`
  mutation UpsertUserMedia($input: UpdateUserMediaInput!) {
    upsertUserMedia(input: $input) {
      id
      mediaId
      status
      progress
      score
      startDate
      finishDate
      note
      customStatusId
      rewatchCount
      isPrivate
      personalNotes
    }
  }
`;
