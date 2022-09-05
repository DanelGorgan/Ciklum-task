import { IResourceAdapter } from '../resources.interface.repository';
import { GitClient } from './gitclient';

describe('ResourcesController', () => {
    let client: GitClient;
    const axiosDataBranch = { data: [{ name: 'branch1', commit: { sha: '123456', url: 'url' } }, { name: 'branch2', commit: { sha: '123456', url: 'url' } }] }

    class resourceAdapterMock implements IResourceAdapter {
        get = (url: string): Promise<any> => {
            if (url.indexOf('repositories') !== -1) {
                return Promise.resolve({ data: [{ fork: false, name: 'test' }, { fork: true, name: 'ttest2' }] });
            }

            if (url.indexOf('error') !== -1) {
               return Promise.reject('unexpected error')
            }

            return Promise.resolve(axiosDataBranch);
        }
    }

    beforeEach(() => {
        client = new GitClient(new resourceAdapterMock());
    })

    it('should return user repositories with success', async () => {
        const expectedResult = [{ fork: false, name: 'test' }];
        expect(await client.getUserRepositories('repositories')).toStrictEqual(expectedResult);
    });

    it('should throw error when finding user branches', async () => {
        const repositories = [{ branches_url: 'https://api.github/error123456789', name: 'repoName', owner: { login: 'test' }, fork: false }];
        await expect(() => client.getUserBranches(repositories)).rejects.toThrow('An unexpected error occured while processing the branches. Please try again');
    });

    it('should return user branches with success', async () => {
        const repositories = [{ branches_url: 'testUrl', name: 'repoName', owner: { login: 'test' }, fork: false }];
        expect(await client.getUserBranches(repositories)).toStrictEqual([{ status: 'fulfilled', value: axiosDataBranch }]);
    });

    it('should return formatted response with success', async () => {
        const repositories = [{ branches_url: 'testUrl', name: 'repoName', owner: { login: 'test' }, fork: false }];
        const axiosBranchResponse = {
            data: [{
                name: 'branch1',
                commit: {
                    sha: 'commitsha1',
                    url: 'url1'
                }
            },
            {
                name: 'branch2',
                commit: {
                    sha: 'commitsha2',
                    url: 'url2'
                }
            }],
            status: 404,
            statusText: 'test',
            config: {},
            headers: {}
        }
        const expectedResult = [{
            name: 'repoName',
            owner: 'test',
            branches: [{ name: 'branch1', commit: 'commitsha1'}, { name: 'branch2', commit: 'commitsha2'}]
        }]
        expect(client.formatResponse(repositories, [{ status: 'fulfilled', value: axiosBranchResponse }])).toStrictEqual(expectedResult);
    });
});
