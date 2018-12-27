const ArticleRouteDict = {
    saveCommitContent: 'article-save-commit-content',
    publish: 'article-publish'
};
const AppCode = 'main';

export class ArticleCtrl {
    constructor(core) {
        this.core = core;
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
}
