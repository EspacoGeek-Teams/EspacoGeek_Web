import { gql } from '@apollo/client';

const findUserMediaLibraryQuery = gql`
  query FindUserMediaLibrary($userId: Int) {
    findUserMediaLibrary(userId: $userId) {
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

export default findUserMediaLibraryQuery;
