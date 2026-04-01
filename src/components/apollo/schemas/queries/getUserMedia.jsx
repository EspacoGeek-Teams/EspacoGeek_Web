import { gql } from '@apollo/client';

const getUserMedia = gql`
  query GetUserMedia($status: String) {
    getUserMedia(status: $status) {
      id
      mediaId
      status
      progress
      score
      startDate
      finishDate
      note
      rewatchCount
      isPrivate
      personalNotes
      media {
        id
        name
        cover
        totalEpisodes
        mediaCategory {
          typeCategory
        }
      }
    }
  }
`;

export default getUserMedia;
