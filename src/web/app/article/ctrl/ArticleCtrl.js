import {web_core} from 'global';

const ArticleRouteDict = {
    saveCommitContent: 'article-save-commit-content',
    publish: 'article-publish',
    fetchReleasedContent: 'article-fetch-released-content'
};
const AppCode = 'main';

export class ArticleCtrl {
    constructor() {
        this.core = web_core();
    }

    async asSaveCommitContent(code, content) {
        await this.core.apiPostJson(
            AppCode,
            ArticleRouteDict.saveCommitContent,
            {code, content}
        );
    }

    async asPublish(code, slug, isPublic) {
        return await this.core.apiPostJson(
            AppCode,
            ArticleRouteDict.publish,
            {code, slug, isPublic}
        );
    }

    async asFetchReleasedContent(slug) {
        const res = await this.core.openPostJson(
            AppCode,
            ArticleRouteDict.fetchReleasedContent,
            {slug}
        );
        if (res && res.content) {
            return res.content;
        }
        throw new Error('Cannot fetch released content');
    }
}
