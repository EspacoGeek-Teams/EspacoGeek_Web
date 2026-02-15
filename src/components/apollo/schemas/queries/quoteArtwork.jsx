import { gql } from '@apollo/client';

const query = gql`
    query DailyQuoteArtwork {
        dailyQuoteArtwork {
            quote
            author
            urlArtwork
        }
    }
`

export default query;
