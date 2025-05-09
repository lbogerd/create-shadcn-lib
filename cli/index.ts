import * as p from "@clack/prompts"
import chalk from "chalk"
import { Command } from "commander"
import { getVersion } from "./utils"

export type CliFlags = {
	projectName: string
	outputDir: string
	noGit: boolean
	noInstall: boolean
	importAlias: string
}

const defaultFlags: CliFlags = {
	projectName: "my-project",
	outputDir: "dist",
	noGit: false,
	noInstall: false,
	importAlias: "~/",
}

export const runCli = async (): Promise<CliFlags> => {
	const flags = defaultFlags

	const program = new Command()
		.name("create-shadcn-lib")
		.description("build, view, and share your own component library")
		.argument("[project-name]", "the name of your project")
		.option("-o, --output-dir <path>", "the directory to output the project")
		.option("-g, --no-git", "skip initializing a git repository")
		.option("-i, --no-install", "skip installing dependencies")
		.option(
			"-a, --import-alias <path>",
			"the alias to use for importing components",
		)
		.version(
			getVersion(),
			"-v, --version",
			"output the current version of this cli",
		)
		.addHelpText(
			"afterAll",
			`\n this cli is very much work in progress, report issues at https://github.com/lbogerd/create-shadcn-lib/issues` +
				`\n HEAVY inspiration from ${chalk
					.hex("#E8DCFF")
					.bold("create-t3-app")}`,
		)
		.parse(process.argv)

	const projectName = program.args[0]

	flags.projectName = projectName ?? flags.projectName
	flags.outputDir = program.opts().outputDir ?? flags.outputDir
	flags.noGit = program.opts().noGit ?? flags.noGit
	flags.noInstall = program.opts().noInstall ?? flags.noInstall
	flags.importAlias = program.opts().importAlias ?? flags.importAlias

	const project = await p.group({
		projectName: () =>
			p.text({
				message: "What should we call your project?",
				initialValue: projectName,
			}),
		outputDir: () =>
			p.text({
				message: "Where should we put the project?",
				initialValue: flags.outputDir,
			}),
		noGit: () =>
			p.confirm({
				message: "Should we initialize a git repository?",
				initialValue: !flags.noGit,
			}),
		noInstall: () =>
			p.confirm({
				message: "Should we install dependencies?",
				initialValue: !flags.noInstall,
			}),
		importAlias: () =>
			p.text({
				message: "What should we use for the import alias?",
				initialValue: flags.importAlias,
			}),
	})

	return {
		...flags,
		...project,
	}
}

runCli()
